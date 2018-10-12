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

  constructor(private af: AngularFirestore) {
    this.foods = af.collection<IFood>('foods').snapshotChanges().pipe(map(data => data.map(foodData =>
      this.createFood(foodData.payload.doc.id, foodData.payload.doc.data())
    )));
  }

  private createFood(id: string, data: IFood): Food {
    return new Food(id, data.name, data.brand, data.proteins, data.carbs, data.fats);
  }

  public AddFood(food: IFood) {
    this.af.collection('foods').add(food);
  }

  public DeleteFood(food: Food) {
    this.af.collection('foods').doc(food.id).delete().catch(error => console.log(error));
  }
}

export interface IFood {
  name: string;
  brand: string;
  proteins: number;
  carbs: number;
  fats: number;
}
