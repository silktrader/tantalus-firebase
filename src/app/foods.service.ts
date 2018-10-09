import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Food } from './foods/food';
import { firestore } from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class FoodsService {

  public foods: Observable<Food[]>;

  constructor(private af: AngularFirestore) {
    this.foods = af.collection<FoodData>('foods').valueChanges().pipe(map(data => data.map(foodData => new Food(foodData))));
  }

  public AddFood(food: Food) {
    this.af.collection('foods').add(food);
    console.log("added " + food);
  }

}

export interface FoodData {
  name: string;
  proteins: number;
  carbs: number;
  fats: number;
  calories: number;
}
