import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable ,  BehaviorSubject } from 'rxjs';
import { map, shareReplay, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Food, FoodData } from './shared/food';
import * as shortid from 'shortid';
import { AuthService } from '../auth/auth.service';
import { IDiaryEntry, IDiaryEntryData } from '../diary/planner.service';

@Injectable({ providedIn: 'root' })
export class FoodsService {

  public readonly foods$: Observable<Food[]>;

  constructor(private readonly af: AngularFirestore, private auth: AuthService) {
    this.foods$ = af.collection<FoodData>('foods').snapshotChanges().pipe(
      shareReplay(1),
      map(data => data.map(foodData => this.createFood(foodData.payload.doc.data(), foodData.payload.doc.id)
      )));
  }

  private createFood(data: FoodData, id: string): Food {
    return new Food({ id, ...data });
  }

  /**
   * Normalise names to facilitate case insensitive search, client side, to:
   * - avoid redundant database writes
   * - speed up updates without waiting for cloud functions completion
   * @param name Mixed case name to normalise
   */
  private getSearchableName(name: string): string {
    return name.toLowerCase();
  }

  // tk handle missing food gracefully
  public getFood(id: string): Observable<Food | undefined> {
    return this.af.doc<FoodData>(`foods/${id}`).valueChanges().pipe(map(data => data ? this.createFood(data, id) : undefined));
  }

  public addFood(food: FoodData): Promise<void> {
    return this.af.doc(`foods/${shortid.generate()}`).set({ ...food, searchableName: this.getSearchableName(food.name) });
  }

  public editFood(data: Readonly<FoodData>): Promise<void> {

    // remove all null values from the form so they aren't stored
    const sanitisedData = {};
    for (const [propName, propValue] of Object.entries(data)) {
      if (propValue === undefined || propValue === null)
        continue;
      sanitisedData[propName] = propValue;
    }

    // the id isn't stored and doesn't meet the schema
    delete sanitisedData['id'];

    // add a searchable name to facilitate case insensitive search
    sanitisedData['searchableName'] = this.getSearchableName(data.name);

    // upload the data without deleting those entries which aren't overwritten
    return this.af.doc(`foods/${data.id}`).set(sanitisedData, { merge: true });
  }

  public deleteFood(food: Food, documents: Array<IDiaryEntryData>): Promise<void> {
    return this.deleteFoodPortions(food, documents).then(
      () => this.af.collection('foods').doc(food.id).delete());
  }

  public getFoodOccurrences(foodID: string) {
    return this.af.collection<IDiaryEntryData>(`/users/${this.auth.userID}/diary`, ref => ref.where('foods', 'array-contains', foodID)).snapshotChanges();
  }

  private deleteFoodPortions(food: Food, documents: Array<IDiaryEntryData>): Promise<void> {

    const batch = this.af.firestore.batch();

    for (const doc of documents) {
      const ref = this.af.doc<IDiaryEntry>(`/users/${this.auth.userID}/diary/${doc.id}`).ref;
      batch.update(ref, {
        portions: doc.portions.filter(portion => portion.foodID !== food.id),
        foods: doc.foods.filter(id => id !== food.id)
      });
    }

    return batch.commit();
  }

  public getFilteredFoods(start: BehaviorSubject<string>): Observable<Food[]> {

    return start.pipe(
      switchMap(filterText => {
        const text = filterText.toLowerCase();
        const endText = text + '\uf8ff';
        return this.af.collection<FoodData>('foods', ref => ref
          .orderBy('searchableName')
          .startAt(text)     // used to transform to uppercase to approximate case insensitive query
          .endAt(endText)
          .limit(10))
          .snapshotChanges();
      }),
      debounceTime(200),
      distinctUntilChanged(),
      map(data => data.map(x => this.createFood(x.payload.doc.data(), x.payload.doc.id))));
  }
}
