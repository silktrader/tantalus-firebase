import { Component, OnInit } from '@angular/core';
import { Food } from '../../foods/food';
import { DiaryEntry } from '../../models/daily-plan';
import { Meal } from '../../models/meal';
import { Router, ActivatedRoute } from '@angular/router';
import { PlannerService, IDiaryEntry, IPortion } from '../planner.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-diary-summary',
  templateUrl: './diary-summary.component.html',
  styleUrls: ['./diary-summary.component.css']
})
export class DiarySummaryComponent implements OnInit {

  public open = false;
  public spin = false;

  diary$: Observable<IDiaryEntry>;
  portions: IPortion[];

  constructor(private readonly router: Router, private readonly route: ActivatedRoute, readonly plannerService: PlannerService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const date = new Date(+params['year'], +params['month'] - 1, +params['day']);
      this.plannerService.initialise(date);
    });

    //this.diary$ = this.plannerService.portions;
    this.plannerService.portions.subscribe(portions => this.portions = portions);
  }

  public doAction(event: any) {
    console.log(event);
  }

  public addMeal() {
    // if (this.dailyPlan == undefined)
    //   this.dailyPlan = new DailyPlan();

    //this.dailyPlan.addPortion(1, new Meal());
    this.router.navigate(['add-portion'], { relativeTo: this.route });
  }

  private createJournalEntry() {

  }

}
