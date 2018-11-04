import { Injectable } from '@angular/core';
import { Observable, of, combineLatest } from 'rxjs';
import { map, startWith, switchMap, tap } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AuthService } from '../auth/auth.service';
import { firestore } from 'firebase';
import { FoodData, FoodDataID } from '../FoodData';
import { PortionData } from './PortionData';
import { Meal } from '../models/meal';
import { Food } from '../foods/food';
import { Portion } from '../models/portion';

@Injectable({ providedIn: 'root' })
export class PlannerService {

  private entryReference: AngularFirestoreDocument<IDiaryEntry>;

  // private portions$: Observable<{ portions: PortionData[], foods: FoodDataID[] }>;
  private meals$: Observable<Meal[]>;

  constructor(private readonly auth: AuthService, private readonly af: AngularFirestore) { }

  private parseDate(date: Date): string {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }

  public initialise(date: Date): void {
    this.entryReference = this.af.doc<IDiaryEntry>(`/users/${this.auth.userID}/diary/${this.parseDate(date)}`);

    if (this.entryReference === null)
      return; // tk throw error and warn user

    let portions: PortionData[];

    this.meals$ = this.entryReference.valueChanges().pipe(
      switchMap((data: IDiaryEntry) => {

        portions = data.portions;

        // draft an array of food ids employed while removing duplicates
        const foodIDs = Array.from(new Set<string>(portions.map(portion => portion.foodID)));

        // fetch food observables and assing missing id property
        const foodData$: Observable<FoodDataID>[] = foodIDs.map(id => this.af.doc<FoodData>(`foods/${id}`).valueChanges().pipe(map((x: FoodData) => ({ ...x, id: id }))));

        return combineLatest(foodData$);
      }),
      map((foods) => this.createMeals(portions, foods))
    );
  }

  public get currentMeals(): Observable<number[]> {

    return this.entryReference.valueChanges().pipe(
      map((x: IDiaryEntry) => Array.from(new Set<number>(x.portions.map(portion => portion.mealID))).sort())
    );
  }

  // tk turn into static?
  public getMealName(index: number, total: number): string {
    if (index === 0)
      return 'Breakfast';

    if (index === 1) {
      if (total > 2)
        return 'Morning Snack';
      return 'Lunch';
    }

    if (index === 2) {
      if (total > 3)
        return 'Lunch';
      return 'Dinner';
    }

    if (index === 4) {
      if (total === 4)
        return 'Dinner';
      return 'Afternoon Snack';
    }

    return 'Dinner';
  }

  public addPortion(portionData: PortionData) {
    (<any>this.entryReference).set({ portions: firestore.FieldValue.arrayUnion(portionData) }, { merge: true });
  }

  public get meals(): Observable<Meal[]> {
    return this.meals$;
  }

  private createMeals(portions: PortionData[], foods: FoodDataID[]): Meal[] {


    const meals: Meal[] = [];

    for (let i = 0; i < portions.length; i++) {

      const { id, quantity, mealID, foodID } = portions[i];

      if (meals[mealID] === undefined)
        meals[mealID] = new Meal(mealID);

      const foodData: FoodDataID | undefined = foods.find(food => food.id === foodID);
      if (foodData === undefined)
        continue;   // tk warn user?

      meals[mealID].addPortion(new Portion(id, quantity, new Food(foodData, foodData.id), mealID));
    }

    // filter out undefined meals when gaps are present, tk sort them later
    return meals.filter(meal => meal !== undefined).sort((a: Meal, b: Meal) => a.order - b.order);
  }

  public getPortion(id: string): Observable<PortionData | undefined> {
    return this.entryReference.valueChanges().pipe(
      map((x: IDiaryEntry) => x.portions.find(portion => portion.id === id))
    );
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
