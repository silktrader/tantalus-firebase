import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlannerService } from '../planner.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-diary-outlet',
  templateUrl: './diary-outlet.component.html',
  styleUrls: ['./diary-outlet.component.css']
})
export class DiaryOutletComponent implements OnInit, OnDestroy {

  private subscription: Subscription;

  constructor(private plannerService: PlannerService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.subscription = this.route.params.subscribe((params: Params) => {
      const { year, month, day } = params;
      this.plannerService.initialise({ year, month, day });
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
