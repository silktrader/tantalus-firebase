import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { FoodsService } from 'src/app/foods.service';
import { Food } from 'src/app/foods/food';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { AddPortionDialogComponent, AddPortionDialogData } from '../add-portion-dialog/add-portion-dialog.component';
import { PlannerService } from '../planner.service';
import { Meal } from 'src/app/models/meal';
import { ActivatedRoute, ParamMap, Params } from '@angular/router';

@Component({
  selector: 'app-add-portion',
  templateUrl: './add-portion.component.html',
  styleUrls: ['./add-portion.component.css']
})
export class AddPortionComponent implements OnInit {

  searchBox: FormControl = new FormControl();

  filteredFoods: Observable<Food[]>;
  startAt: BehaviorSubject<string | null> = new BehaviorSubject('');
  selectedPortions: AddPortionDialogData[] = [];

  constructor(private readonly foodsService: FoodsService, private readonly plannerService: PlannerService, private dialog: MatDialog, private route: ActivatedRoute) { }

  ngOnInit() {
    this.filteredFoods = this.foodsService.getFilteredFoods(this.startAt);

    // const params: Params = this.route.parent.snapshot.params;
    // console.log(params);
    // const date = new Date(params);
    // console.log(params['year']);
    // console.log(date);

    this.route.parent.params.subscribe(params => {
      const date = new Date(+params['year'], +params['month'] - 1, +params['day']);
      console.log(date);
      this.plannerService.initialise(date);
    });
  }

  search($event): void {
    let inputText = $event.target.value;
    inputText = inputText.toLowerCase();
    this.startAt.next(inputText);
  }

  openPortionDialog(food: Food, meal: Meal): void {
    const dialog = this.dialog.open(AddPortionDialogComponent, {
      data: {
        food: food,
        meal: meal || new Meal()
      }
    });

    dialog.afterClosed().subscribe(data => {
      if (data == undefined)
        return;
      this.selectedPortions.push({ food: data.food, quantity: data.quantity, meal: meal || new Meal() });
    });
  }

  deletePortion(portionData: AddPortionDialogData): void {
    this.selectedPortions.splice(this.selectedPortions.indexOf(portionData), 1);
  }

  registerPortions() {
    this.selectedPortions.forEach(element => {
      console.log(element);
      this.plannerService.addPortion({ foodID: element.food.id, quantity: element.quantity, mealID: element.meal.id });
    });
  }

}
