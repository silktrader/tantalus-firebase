import { Injectable } from '@angular/core';
import { Observable, of, combineLatest } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AuthService } from '../auth/auth.service';
import { firestore } from 'firebase';
import { FoodData, FoodDataID } from '../FoodData';
import { PortionData } from './PortionData';

@Injectable({ providedIn: 'root' })
export class PlannerService {

  private portions$: Observable<{ portions: PortionData[], foods: FoodDataID[] }>;
  private entryReference: AngularFirestoreDocument<IDiaryEntry>;

  constructor(private readonly auth: AuthService, private readonly af: AngularFirestore) { }

  private parseDate(date: Date): string {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }

  public initialise(date: Date): void {
    this.entryReference = this.af.doc<IDiaryEntry>(`/users/${this.auth.userID}/diary/${this.parseDate(date)}`);

    if (this.entryReference === null)
      return; // tk throw error and warn user

    let portions: PortionData[];

    this.portions$ = this.entryReference.valueChanges().pipe(
      switchMap((data: IDiaryEntry) => {

        portions = data.portions;

        // draft an array of food ids employed while removing duplicates
        const foodIDs = Array.from(new Set<string>(portions.map(portion => portion.foodID)));

        // fetch food observables and assing missing id property
        const foodData$: Observable<FoodDataID>[] = foodIDs.map(id => this.af.doc<FoodData>(`foods/${id}`).valueChanges().pipe(map((x: FoodData) => ({ ...x, id: id }))));

        return combineLatest(foodData$);
      }),
      map((result) => ({ portions, foods: result }))
    );
  }

  public addPortion(portionData: PortionData) {
    (<any>this.entryReference).set({ portions: firestore.FieldValue.arrayUnion(portionData) }, { merge: true });
  }

  public get portions(): Observable<{ portions: PortionData[], foods: FoodDataID[] }> {
    return this.portions$;
  }
}

export interface IDiaryEntry {
  comments?: string;
  portions: PortionData[];
}

export interface DiaryEntryData {
  comments?: string;
  portionsFoodData: PortionFoodData;
}

export interface PortionFoodData {
  id: string;
  mealID: number;
  foodData: FoodData;
  quantity: number;
}
