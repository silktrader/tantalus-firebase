import { Component, OnInit, OnDestroy } from '@angular/core';
import { Food } from '../../foods/food';
import { Meal } from '../../models/meal';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { PlannerService, DateYMD } from '../planner.service';
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

  private meals: ReadonlyArray<Meal>;
  private subscription: Subscription;

  constructor(private readonly router: Router, private readonly route: ActivatedRoute, readonly plannerService: PlannerService, public uiService: UiService) { }

  ngOnInit() {
    this.subscription = this.plannerService.meals.subscribe(meals => {
      if (meals === undefined)
        return;

      this.meals = meals;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  public get date(): Readonly<Date> {
    return this.plannerService.date;
  }

  public get hasContents(): boolean {
    return this.meals !== undefined && this.meals.length > 0;
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

  public deleteAll(): void {

    this.plannerService.deleteDay().subscribe(result => {
      if (result === undefined)
        this.uiService.warn(`Couldn't delete ${this.date.toLocaleDateString()}'s entries`);
      else this.uiService.notify(`Deleted ${this.date.toLocaleDateString()}'s entries`, 'Undo', () => {
        this.plannerService.writeDay(result);
        this.uiService.warn(`Restored ${this.date.toLocaleDateString()}'s entries`);
      });
    });
  }
}
