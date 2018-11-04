import { Component, OnInit } from '@angular/core';
import { Food } from '../../foods/food';
import { Meal } from '../../models/meal';
import { Router, ActivatedRoute } from '@angular/router';
import { PlannerService, IDiaryEntry } from '../planner.service';
import { PortionData } from '../PortionData';
import { Observable } from 'rxjs';
import { FoodData, FoodDataID } from 'src/app/FoodData';
import { Portion } from 'src/app/models/portion';

@Component({
  selector: 'app-diary-summary',
  templateUrl: './diary-summary.component.html',
  styleUrls: ['./diary-summary.component.css']
})
export class DiarySummaryComponent implements OnInit {

  public open = false;
  public spin = false;

  private _meals: Meal[] = [];

  constructor(private readonly router: Router, private readonly route: ActivatedRoute, readonly plannerService: PlannerService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const date = new Date(+params['year'], +params['month'] - 1, +params['day']);
      this.plannerService.initialise(date);
    });

    this.plannerService.meals.subscribe(data => this._meals = data);
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

  public getMealName(index: number) {
    return this.plannerService.getMealName(index, 1 + Math.max(...this._meals.map(meal => meal.order)));
  }
}
