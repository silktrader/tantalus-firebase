import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { FoodsService } from 'src/app/foods.service';
import { Food } from 'src/app/foods/food';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material';
import { AddPortionDialogComponent, AddPortionDialogData } from '../add-portion-dialog/add-portion-dialog.component';
import { PlannerService } from '../planner.service';
import { Meal } from 'src/app/models/meal';
import { ActivatedRoute } from '@angular/router';
import * as shortid from 'shortid';

@Component({
  selector: 'app-add-portion',
  templateUrl: './add-portion.component.html',
  styleUrls: ['./add-portion.component.css']
})
export class AddPortionComponent implements OnInit {

  searchBox: FormControl = new FormControl();

  filteredFoods$: Observable<Food[]>;
  startAt$: BehaviorSubject<string> = new BehaviorSubject('');
  selectedPortions: AddPortionDialogData[] = [];

  constructor(private readonly foodsService: FoodsService, private readonly plannerService: PlannerService,
    private dialog: MatDialog, private route: ActivatedRoute) { }

  ngOnInit() {
    this.filteredFoods$ = this.foodsService.getFilteredFoods(this.startAt$);

    if (this.route.parent === null) {
      console.log('ERROR');
      return; // tk throw error warn user about wrong URL
    }

    this.route.parent.params.subscribe(params => {
      const date = new Date(+params['year'], +params['month'] - 1, +params['day']);
      this.plannerService.initialise(date);
    });
  }

  search($event): void {
    let inputText = $event.target.value;
    inputText = inputText.toLowerCase();
    this.startAt$.next(inputText);
  }

  openPortionDialog(food: Food): void {

    const dialog = this.dialog.open(AddPortionDialogComponent, {
      data: {
        food: food,
        currentMeals$: this.plannerService.currentMeals
      }
    });

    dialog.afterClosed().subscribe((data: AddPortionDialogData) => {
      if (data === undefined)
        return;
      this.selectedPortions.push({ food: data.food, quantity: data.quantity, mealID: data.mealID });
    });
  }

  deletePortion(portionData: AddPortionDialogData): void {
    this.selectedPortions.splice(this.selectedPortions.indexOf(portionData), 1);
  }

  registerPortions() {
    for (let i = 0; i < this.selectedPortions.length; i++) {
      const data = this.selectedPortions[i];
      this.plannerService.addPortion({ id: shortid.generate(), foodID: data.food.id, quantity: data.quantity, mealID: data.mealID });
    }

    this.selectedPortions = [];
  }

}
