import { Component, OnInit, OnDestroy } from '@angular/core';
import { Food } from '../../foods/food';
import { Meal } from '../../models/meal';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { PlannerService } from '../planner.service';
import { Observable, Subscription, of } from 'rxjs';
import { Portion } from 'src/app/models/portion';
import { switchMap, tap, map } from 'rxjs/operators';
import { UiService } from 'src/app/ui.service';

@Component({
  selector: 'app-diary-summary',
  templateUrl: './diary-summary.component.html',
  styleUrls: ['./diary-summary.component.css']
})
export class DiarySummaryComponent implements OnInit, OnDestroy {

  public open = false;
  public spin = false;

  private meals: Meal[];
  private subscription: Subscription;
  private date: Date;

  constructor(private readonly router: Router, private readonly route: ActivatedRoute, readonly plannerService: PlannerService, public uiService: UiService) { }

  ngOnInit() {
    let date: Date;
    this.subscription = this.route.params.pipe(
      switchMap((params: Params) => {
        const { year, month, day } = params;
        date = new Date(year, month - 1, day);
        return this.plannerService.getMeals({ year, month, day });
      })).subscribe((meals) => {

        // tk verify date first then verify meals
        console.log(date);
        this.date = date;

        if (meals === undefined)
          return;

        this.meals = meals;
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  public get title(): string {
    return this.date === undefined ? '' : this.date.toLocaleString();
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
