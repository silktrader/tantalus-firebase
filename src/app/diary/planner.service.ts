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
import { FoodData } from '../FoodData';
import { PortionData } from './PortionData';

@Injectable({ providedIn: 'root' })
export class PlannerService {

  private portions$: Observable<{ portions: PortionData[], foods: FoodData[] }>;
  private entryReference: AngularFirestoreDocument<any>;

  constructor(private readonly auth: AuthService, private readonly af: AngularFirestore, private route: ActivatedRoute) {

  }

  private parseDate(date: Date): string {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }

  public initialise(date: Date): void {
    this.entryReference = this.af.doc<IDiaryEntry>(`/users/${this.auth.userID}/diary/${this.parseDate(date)}`);
    this.portions$ = this.entryReference.valueChanges().pipe(
      startWith({ comments: '', portions: [] }),
      switchMap(data => {

        const portions: PortionData[] = data.portions;

        // tk can improve by caching foods data in case of duplicates to avoid multiple firestore reads
        const foodData$: Observable<FoodData>[] = portions.map(portion => this.af.doc<FoodData>(`foods/${portion.foodID}`).valueChanges());

        // tk handle missing food with empty observable?

        return combineLatest(...foodData$, (...foods) => {
          return { portions: portions, foods: foods };
        });
      })
    );

  }

  public addPortion(portion: PortionData) {
    const portionData = { id: shortid.generate(), ...portion };

    // update the document otherwise
    this.entryReference.set({ portions: firestore.FieldValue.arrayUnion(portionData) }, { merge: true });
  }

  public get portions(): Observable<{ portions: PortionData[], foods: FoodData[] }> {
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
