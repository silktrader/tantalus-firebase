import { Component, OnInit } from '@angular/core';
import { Food } from '../../foods/food';
import { Meal } from '../../models/meal';
import { Router, ActivatedRoute } from '@angular/router';
import { PlannerService, IDiaryEntry } from '../planner.service';
import { PortionData } from '../PortionData';
import { Observable } from 'rxjs';
import { FoodData } from 'src/app/FoodData';
import { Portion } from 'src/app/models/portion';

@Component({
  selector: 'app-diary-summary',
  templateUrl: './diary-summary.component.html',
  styleUrls: ['./diary-summary.component.css']
})
export class DiarySummaryComponent implements OnInit {

  public open = false;
  public spin = false;

  // private _meals = new Map<Number, Meal>();
  private _meals: Meal[] = [];

  constructor(private readonly router: Router, private readonly route: ActivatedRoute, readonly plannerService: PlannerService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const date = new Date(+params['year'], +params['month'] - 1, +params['day']);
      this.plannerService.initialise(date);
    });

    this.plannerService.portions.subscribe(mergedData => this.createMeals(mergedData.portions, mergedData.foods));
  }

  private createMeals(portions: PortionData[], foods: FoodData[]): void {

    const meals: Meal[] = [];

    for (let i = 0; i < portions.length; i++) {

      const { id, quantity, mealID } = portions[i];

      if (meals[mealID] === undefined)
        meals[mealID] = new Meal();

      meals[mealID].addPortion(new Portion(id, quantity, new Food(foods[i]), mealID));
    }

    // filter out undefined meals when gaps are present, tk sort them later
    this._meals = [];
    for (const meal of meals) {
      if (meal === undefined)
        continue;
      this._meals.push(meal);
    }

  }

  get meals(): ReadonlyArray<Meal> {
    return this._meals;
  }

  public doAction(event: any) {
    console.log(event);
  }

  public addMeal() {
    this.router.navigate(['add-portion'], { relativeTo: this.route });
  }
}
