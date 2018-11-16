import { Component, OnInit, OnDestroy } from '@angular/core';
import { Food } from '../../foods/food';
import { Meal } from '../../models/meal';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { PlannerService } from '../planner.service';
import { Subscription } from 'rxjs';
import { UiService } from 'src/app/ui.service';

@Component({
  selector: 'app-diary-summary',
  templateUrl: './diary-summary.component.html',
  styleUrls: ['./diary-summary.component.css']
})
export class DiarySummaryComponent implements OnInit, OnDestroy {

  public open = false;
  public spin = false;

  public meals: ReadonlyArray<Meal>;
  private subscription: Subscription;

  constructor(private readonly router: Router, private readonly route: ActivatedRoute, readonly plannerService: PlannerService, public uiService: UiService) { }

  ngOnInit() {
    this.subscription = this.plannerService.meals.subscribe(meals => {
      if (meals === undefined)
        return;

      this.meals = meals;

      // meals are sorted in the observable, set the last meal as the default one to new additions - tk move this into planner?
      this.plannerService.focusedMeal = this.meals[this.meals.length - 1].order;
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
