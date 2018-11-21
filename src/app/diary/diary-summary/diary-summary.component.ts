import { Component, OnInit, OnDestroy } from '@angular/core';
import { Food } from '../../foods/food';
import { Meal } from '../../models/meal';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { PlannerService } from '../planner.service';
import { Subscription } from 'rxjs';
import { UiService } from 'src/app/ui.service';
import { DiaryEntry } from 'src/app/models/diary-entry';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-diary-summary',
  templateUrl: './diary-summary.component.html',
  styleUrls: ['./diary-summary.component.css']
})
export class DiarySummaryComponent implements OnInit, OnDestroy {

  public focus: string;

  public columns: ReadonlyArray<string> = ['Calories', 'Macronutrients'];
  public columnSelector = new FormControl();

  public meals: ReadonlyArray<Meal> = [];
  public diaryEntry: DiaryEntry | undefined;
  private subscription: Subscription = new Subscription();

  constructor(private readonly router: Router, private readonly route: ActivatedRoute, readonly plannerService: PlannerService, public uiService: UiService) { }

  ngOnInit() {

    // sets up the colums selector and specify a default value
    this.subscription.add(this.columnSelector.valueChanges.subscribe(value => this.focus = value));
    this.columnSelector.setValue(this.columns[0]);

    this.subscription.add(this.plannerService.meals.subscribe(meals => {

      this.meals = meals;
      this.diaryEntry = new DiaryEntry(meals);

      // meals are sorted in the observable, set the last meal as the default one to new additions - tk move this into planner?
      this.plannerService.focusedMeal = this.meals.length > 0 ? this.meals[this.meals.length - 1].order : 0;
    }));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  public get date(): Readonly<Date> {
    return this.plannerService.date;
  }

  public get hasContents(): boolean {
    return this.meals.length > 0;
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
