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
    this.foods = af.collection<FoodData>('foods').valueChanges().pipe(map(data => data.map(foodData => this.createFood(foodData))));
  }

  private createFood(data: FoodData): Food {
    return new Food(data.name, data.brand, data.proteins, data.carbs, data.fats);
  }

  public AddFood(food: Food) {
    this.af.collection('foods').add(food);
  }

}

export interface FoodData {
  name: string;
  brand: string;
  proteins: number;
  carbs: number;
  fats: number;
  calories: number;
}
