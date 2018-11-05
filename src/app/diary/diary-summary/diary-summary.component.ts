import { Component, OnInit } from '@angular/core';
import { Food } from '../../foods/food';
import { Meal } from '../../models/meal';
import { Router, ActivatedRoute } from '@angular/router';
import { PlannerService } from '../planner.service';
import { Observable } from 'rxjs';
import { Portion } from 'src/app/models/portion';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-diary-summary',
  templateUrl: './diary-summary.component.html',
  styleUrls: ['./diary-summary.component.css']
})
export class DiarySummaryComponent implements OnInit {

  public open = false;
  public spin = false;

  private meals: Meal[];

  constructor(private readonly router: Router, private readonly route: ActivatedRoute, readonly plannerService: PlannerService) { }

  ngOnInit() {
    this.route.params.pipe(
      switchMap(params => this.plannerService.getMeals({ year: params.year, month: params.month, day: params.day }))).subscribe(meals => this.meals = meals);
    // tk remember to unsubscribe
  }

  public doAction(event: any) {
    console.log(event);
  }

  public addMeal() {
    this.router.navigate(['add-portion'], { relativeTo: this.route });
  }

  public getMealName(index: number) {
    return this.plannerService.getMealName(index, 1 + Math.max(...this.meals.map(meal => meal.order)));
  }
}
