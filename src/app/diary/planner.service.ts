import { Injectable } from '@angular/core';
import { Observable, of, combineLatest, Subject, forkJoin } from 'rxjs';
import { map, switchMap, shareReplay, flatMap, mergeMap } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AuthService } from '../auth/auth.service';
import { firestore } from 'firebase';
import { FoodData } from '../FoodData';
import { PortionData } from './PortionData';
import { Meal } from '../models/meal';
import { Food } from '../foods/food';
import { Portion } from '../models/portion';
import { FoodsService } from '../foods.service';
import * as shortid from 'shortid';
import { DiaryEntry } from '../models/diary-entry';
import { UiService } from '../ui.service';

@Injectable({ providedIn: 'root' })
export class PlannerService {

  private _date: Date;
  private document: AngularFirestoreDocument<IDiaryEntry>;

  public diaryEntry: DiaryEntry = new DiaryEntry([]);
  private d: Subject<DateYMD> = new Subject();

  constructor(private auth: AuthService, private af: AngularFirestore, private foodService: FoodsService, private ui: UiService) {

    let document: AngularFirestoreDocument<IDiaryEntry>;
    let portions: PortionData[];

    this.d.pipe(
      switchMap(dateYMD => {
        // don't need to store document!! just store date tk!
        document = this.getDocument(dateYMD);
        return document.valueChanges();
      }),
      switchMap(diaryData => {

        if (diaryData === undefined) {
          portions = [];
          return of([]);
        }

        portions = diaryData.portions;

        // draft an array of food ids employed while removing duplicates
        const foodIDs = Array.from(new Set<string>(portions.map(portion => portion.foodID)));

        // fetch food observables and assing missing id property
        const foods$ = foodIDs.map(id => this.foodService.getFood(id));

        // for some reason combineLatest([]) doesn't emit values whereas of([]) does
        return combineLatest(foods$);
      })).subscribe(foods => {
        this.document = document;
        this.diaryEntry = new DiaryEntry(this.createMeals(portions, foods));
        this.focusedMeal = this.getLatestMeal(this.diaryEntry.meals);
      });
  }

  public focusedMeal = 0;

  public get date(): Readonly<Date> {
    return this._date;
  }

  // should this be configurable by users? tk
  public get availableMealsIDs(): ReadonlyArray<number> {
    return Meal.mealIDs;
  }

  public initialise(dateYMD: DateYMD) {

    this.d.next(dateYMD);
    this._date = new Date(dateYMD.year, dateYMD.month - 1, dateYMD.day); // tk change and verify URL!
  }

  private getDocument(dateURL: DateYMD): AngularFirestoreDocument<IDiaryEntry> {
    return this.af.doc<IDiaryEntry>(`/users/${this.auth.userID}/diary/${+dateURL.year}-${+dateURL.month}-${+dateURL.day}`);
  }

  private createMeals(portions: PortionData[], foods: Food[]): Meal[] {
    const meals: Array<Meal> = [];

    for (let i = 0; i < portions.length; i++) {
      const { id, quantity, mealID, foodID } = portions[i];
      const selectedFood: Food | undefined = foods.find(food => food.id === foodID);

      if (id === undefined || selectedFood === undefined) {
        this.ui.warn(`Unable to read portion ${id || 'missing ID'} of ${selectedFood || 'missing food'}`);
        continue;
      }

      // create the meal whether necessary
      if (meals[mealID] === undefined)
        meals[mealID] = new Meal(mealID);

      meals[mealID].addPortion(new Portion(id, quantity, selectedFood, mealID));
    }

    // filter out undefined meals when gaps are present, tk sort them later
    return meals.filter(meal => meal !== undefined).sort((a: Meal, b: Meal) => a.order - b.order);
  }

  public getMealName(index: number) {
    return Meal.getName(index);
  }

  public get mealNumbers(): ReadonlyArray<Number> {
    return this.diaryEntry.meals.map(meal => meal.order);
  }

  private getLatestMeal(meals: ReadonlyArray<Meal>): number {
    let latestMealID = 0;
    for (let i = 0; i < meals.length; i++) {
      if (meals[i].order > latestMealID)
        latestMealID = meals[i].order;
    }
    return latestMealID;
  }

  public get meals(): ReadonlyArray<Meal> {
    return this.diaryEntry.meals;
  }

  public getPortion(portionID: string): Portion | undefined {
    for (let i = 0; i < this.meals.length; i++) {
      for (let x = 0; x < this.meals[i].portions.length; x++) {
        if (this.meals[i].portions[x].id === portionID) {
          return this.meals[i].portions[x];
        }
      }
    }
  }

  public addPortion(portionData: PortionData): Promise<PortionData> {

    // generate a short ID and append it to the portion data
    const portionDataID = { id: shortid.generate(), ...portionData };

    // do not rewrite the entire document but add to its portions array
    return (<any>this.document).set(
      { portions: firestore.FieldValue.arrayUnion(portionDataID) },
      { merge: true }
    ).then(() => portionDataID);
  }

  // tk can it be shortened to one set operation?
  public changePortion(removedPortion: PortionData, newPortion: PortionData): Promise<[void, void]> {
    const document = <any>this.document;
    const removal: Promise<void> = document.set(
      { portions: firestore.FieldValue.arrayRemove(removedPortion) },
      { merge: true }
    );
    const addition: Promise<void> = document.set(
      { portions: firestore.FieldValue.arrayUnion(newPortion) },
      { merge: true }
    );
    return Promise.all([removal, addition]);
  }

  public removePortion(removedPortion: PortionData): Promise<void> {
    return (<any>this.document).update(
      { portions: firestore.FieldValue.arrayRemove(removedPortion) }
    );
  }

  public deleteDay(): Observable<IDiaryEntry> {

    return this.document.valueChanges().pipe(
      switchMap((contents) => {
        if (contents === undefined)
          return of();

        return this.document.delete().then(() => {
          return contents;
        });
      })
    );
  }

  public writeDay(entry: IDiaryEntry): Promise<void> {
    return this.document.set(entry);
  }
}

export interface DateYMD {

  readonly year: number;
  readonly month: number;
  readonly day: number;
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
