import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Food } from 'src/app/foods/food';
import { FormControl } from '@angular/forms';
import { Meal } from 'src/app/models/meal';

@Component({
  selector: 'app-add-portion-dialog',
  templateUrl: './add-portion-dialog.component.html',
  styleUrls: ['./add-portion-dialog.component.css']
})
export class AddPortionDialogComponent {

  quantityInput: FormControl = new FormControl();

  constructor(public dialogRef: MatDialogRef<AddPortionDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: AddPortionDialogData) {
  }

  private get food(): Food {
    return this.data.food;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

export interface AddPortionDialogData {
  meal: Meal;
  food: Food;
  quantity: number;
}
