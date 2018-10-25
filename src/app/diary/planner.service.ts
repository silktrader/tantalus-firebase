import { Injectable } from '@angular/core';
import { DiaryEntry } from '../models/daily-plan';
import { Portion } from '../models/portion';
import { Observable, of, combineLatest } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AuthService } from '../auth/auth.service';
import { firestore } from 'firebase';
import * as shortid from 'shortid';
import { startWith, tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { FoodData } from '../foods.service';
import { Food } from '../foods/food';

@Injectable({ providedIn: 'root' })
export class PlannerService {

  private portions$: Observable<IPortion[]>;
  private diaryDoc: AngularFirestoreDocument<any>;

  constructor(private readonly auth: AuthService, private readonly af: AngularFirestore, private route: ActivatedRoute) {

  }

  private parseDate(date: Date): string {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }

  public initialise(date: Date): void {
    console.log('initialised');
    this.diaryDoc = this.af.doc<IDiaryEntry>(`/users/${this.auth.userID}/diary/${this.parseDate(date)}`);
    this.portions$ = this.diaryDoc.valueChanges().pipe(
      startWith({ comments: '', portions: [] }),
      tap(x => console.log(x)),
      switchMap(data => {

        const portions: IPortion[] = data.portions;

        // tk can improve by caching foods data in case of duplicates to avoid multiple firestore reads
        const foodData$: Observable<FoodData>[] = portions.map(portion => this.af.doc<FoodData>(`foods/${portion.foodID}`).valueChanges());

        // tk handle missing food with empty observable?

        return combineLatest(...foodData$, (...foods) => {
          portions.forEach((portion, index) => {
            const { id, name, brand, proteins, carbs, fats } = foods[index]
            portion.food = new Food(id, name, brand, proteins, carbs, fats);
          });
          return portions;
        });
      })
    );

  }

  public addPortion(portion: IPortion) {
    const portionData = { id: shortid.generate(), ...portion };

    // update the document otherwise
    this.diaryDoc.set({ portions: firestore.FieldValue.arrayUnion(portionData) }, { merge: true });
  }

  public get portions(): Observable<IPortion[]> {
    return this.portions$
  }
}

export interface IDiaryEntry {
  comments?: string;
  portions: IPortion[];
}

export interface IPortion {
  id?: string;
  mealID: number;
  foodID: string;
  food?: Food;
  quantity: number;
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
