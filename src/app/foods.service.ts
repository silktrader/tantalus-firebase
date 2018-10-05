import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Food } from './foods/food';

@Injectable({
  providedIn: 'root'
})
export class FoodsService {

  public foods: Observable<Food[]>;

  constructor(firestore: AngularFirestore) {
    this.foods = firestore.collection<FoodData>('foods').valueChanges().pipe(map(data => data.map(foodData => new Food(foodData))));
  }
}

export interface FoodData {
  name: string;
  proteins: number;
  carbs: number;
  fats: number;
}
