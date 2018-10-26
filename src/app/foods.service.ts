import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map, shareReplay, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Food } from './foods/food';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as shortid from 'shortid';
import { FoodData } from './FoodData';

@Injectable({
  providedIn: 'root'
})
export class FoodsService {

  public readonly foods$: Observable<Food[]>;

  constructor(private readonly af: AngularFirestore) {
    this.foods$ = af.collection<FoodData>('foods').snapshotChanges().pipe(
      shareReplay(1),
      map(data => data.map(foodData => this.createFood({ ...foodData.payload.doc.data(), id: foodData.payload.doc.id })
      )));
    // this.foods$ = af.collection<IFood>('foods').valueChanges().pipe(map(data => data.map(foodData =>
    //   this.createFood({ ...foodData, id: "asd" })
    // )));
  }

  private createFood(data: FoodData): Food {
    return new Food(data);
  }

  public getFood(id: string): Observable<Food> {
    return this.af.doc<FoodData>(`foods/${id}`).valueChanges().pipe(map(data => this.createFood({ ...data, id: id })));
  }

  public addFood(food: FoodData): Promise<void> {
    return this.af.doc(`foods/${shortid.generate()}`).set(food);
  }

  public editFood(id: string, food: FoodData) {
    this.af.doc(`foods/${id}`).set(food);
  }

  public deleteFood(food: FoodData): Promise<void> {
    return this.af.collection('foods').doc(food.id).delete().catch(error => console.log(error));
  }

  public getFilteredFoods(start: BehaviorSubject<string>): Observable<Food[]> {
    return start.pipe(
      switchMap(startText => {
        const endText = startText + '\uf8ff';
        return this.af.collection<FoodData>('foods', ref => ref
          .orderBy('name')
          .startAt(startText.toUpperCase())     // must transform to uppercase for both variants to be included
          .endAt(endText)
          .limit(10))
          .snapshotChanges();
      }),
      debounceTime(200),
      distinctUntilChanged(),
      map(data => data.map(x => this.createFood({ ...x.payload.doc.data(), id: x.payload.doc.id }))));
  }
}