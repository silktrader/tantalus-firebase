import { Component, OnInit } from '@angular/core';
import { Food } from '../../../foods/food';
import { DailyPlan } from '../../../models/daily-plan';
import { Meal } from '../../../models/meal';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-diary-summary',
  templateUrl: './diary-summary.component.html',
  styleUrls: ['./diary-summary.component.css']
})
export class DiarySummaryComponent implements OnInit {

  private dailyPlan: DailyPlan;

  public open = false;
  public spin = false;

  constructor(private readonly router: Router, private readonly route: ActivatedRoute) { }

  ngOnInit() { }

  public doAction(event: any) {
    console.log(event);
  }

  public addMeal() {
    if (this.dailyPlan == undefined)
      this.dailyPlan = new DailyPlan();

    //this.dailyPlan.addPortion(1, new Meal());
    this.router.navigate(['add-portion'], { relativeTo: this.route });
  }

  private createJournalEntry() {

  }

}
