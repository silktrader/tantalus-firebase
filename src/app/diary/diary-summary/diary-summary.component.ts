import { Component, OnInit, OnDestroy } from '@angular/core';
import { Food } from '../../foods/shared/food';
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

  private subscription: Subscription = new Subscription();

  constructor(private router: Router, private route: ActivatedRoute, readonly planner: PlannerService, public ui: UiService) { }

  ngOnInit() {

    // sets up the colums selector and specify a default value
    this.subscription.add(this.columnSelector.valueChanges.subscribe(value => this.focus = value));
    this.columnSelector.setValue(this.columns[0]);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  public get entry(): DiaryEntry {
    return this.planner.diaryEntry.getValue();
  }

  public get date(): Readonly<Date> {
    return this.planner.date;
  }

  public get hasContents(): boolean {
    return this.planner.meals.length > 0;
  }

  public addMeal() {
    this.router.navigate(['add-portion'], { relativeTo: this.route });
  }

  public deleteAll(): void {

    this.planner.deleteDay().then(result => {
      if (result === null)
        this.ui.warn(`Couldn't delete ${this.date.toLocaleDateString()}'s entries`);
      else this.ui.notify(`Deleted ${this.date.toLocaleDateString()}'s entries`, 'Undo', () => {
        this.planner.restoreDay(result);
        this.ui.warn(`Restored ${this.date.toLocaleDateString()}'s entries`);
      });
    });
  }
}
