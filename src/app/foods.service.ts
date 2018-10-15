import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { map, } from 'rxjs/operators';
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

  public getFood(id: string): Observable<Food> {
    return this.af.doc<IFood>('foods/' + id).valueChanges().pipe(map(data => this.createFood(id, data)));
  }

  public addFood(food: IFood) {
    this.af.collection('foods').add(food);
  }

  public editFood(id: string, food: IFood) {
    this.af.doc('foods/' + id).set(food);
  }

  public deleteFood(food: IFood) {
    this.af.collection('foods').doc(food.id).delete().catch(error => console.log(error));
  }
}

export interface IFood {
  id?: string;
  name: string;
  brand: string;
  proteins: number;
  carbs: number;
  fats: number;
}
