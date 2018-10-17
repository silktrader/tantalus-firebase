import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Food } from './foods/food';
import * as shortid from 'shortid';

@Injectable({
  providedIn: 'root'
})
export class FoodsService {

  public readonly foods$: Observable<Food[]>;

  constructor(private readonly af: AngularFirestore) {
    this.foods$ = af.collection<IFood>('foods').snapshotChanges().pipe(shareReplay(1), map(data => data.map(foodData => {
      return this.createFood({ ...foodData.payload.doc.data(), id: foodData.payload.doc.id });
    }
    )));
    // this.foods$ = af.collection<IFood>('foods').valueChanges().pipe(map(data => data.map(foodData =>
    //   this.createFood({ ...foodData, id: "asd" })
    // )));
  }

  private createFood(data: IFood): Food {
    return new Food(data.id, data.name, data.brand, data.proteins, data.carbs, data.fats);
  }

  public getFood(id: string): Observable<Food> {
    return this.af.doc<IFood>(`foods/${id}`).valueChanges().pipe(map(data => this.createFood({ ...data, id: id })));
  }

  public addFood(food: IFood): Promise<void> {
    return this.af.doc(`foods/${shortid.generate()}`).set(food);
  }

  public editFood(id: string, food: IFood) {
    this.af.doc(`foods/${id}`).set(food);
  }

  public deleteFood(food: IFood): Promise<void> {
    return this.af.collection('foods').doc(food.id).delete().catch(error => console.log(error));
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
