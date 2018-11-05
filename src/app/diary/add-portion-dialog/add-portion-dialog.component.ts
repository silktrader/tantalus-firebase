import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Food } from 'src/app/foods/food';
import { FormControl } from '@angular/forms';
import { PlannerService } from '../planner.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-add-portion-dialog',
  templateUrl: './add-portion-dialog.component.html',
  styleUrls: ['./add-portion-dialog.component.css']
})
export class AddPortionDialogComponent {

  quantityInput: FormControl = new FormControl();

  constructor(public dialogRef: MatDialogRef<AddPortionDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: AddPortionDialogData, public planner: PlannerService) {
    // planner.currentMeals.pipe(first()).subscribe(meals => data.mealID = meals.length - 1);
    // tk extra document read probably
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onEnter(): void {
    this.dialogRef.close(this.data);
  }
}

export interface AddPortionDialogData {
  food: Food;
  mealID: number;
  quantity: number;
}
