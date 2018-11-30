import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { FoodsService } from 'src/app/foods.service';
import { Subscription } from 'rxjs';
import { Portion } from 'src/app/models/portion';
import { IDiaryEntryData } from 'src/app/diary/planner.service';
import { Food } from '../shared/food';

export interface DeleteFoodDialogData {
  food: Food;
}

@Component({
  selector: 'app-delete-food-dialog',
  templateUrl: './delete-food-dialog.component.html',
  styleUrls: ['./delete-food-dialog.component.css']
})
export class DeleteFoodDialogComponent implements OnInit, OnDestroy {

  private subscription: Subscription;

  public documents = new Array<IDiaryEntryData>();
  public portions = new Array<{ date: string, portion: Portion }>();

  constructor(@Inject(MAT_DIALOG_DATA) public data: DeleteFoodDialogData, private foodsService: FoodsService) { }

  ngOnInit() {

    this.subscription = this.foodsService.getFoodOccurrences(this.data.food.id).subscribe(snapshots => {

      for (const snapshot of snapshots) {

        const id = snapshot.payload.doc.id;
        const data = snapshot.payload.doc.data();

        // populate the collection of documents
        this.documents.push({ id: id, ...data });

        // populate the collection of portions for display purposes
        for (const portion of data.portions) {
          if (portion.foodID === this.data.food.id && portion.id) {
            this.portions.push({ date: id, portion: new Portion(portion.id, portion.quantity, this.data.food, portion.mealID) });
          }
        }
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  public get dialogResult() {
    return { documents: this.documents, portions: this.portions };
  }

}
