import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlannerService, DateURL } from '../planner.service';
import { ActivatedRoute } from '@angular/router';
import { Meal } from 'src/app/models/meal';
import { Portion } from 'src/app/models/portion';
import { Subscription, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { FormControl, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-edit-portion',
  templateUrl: './edit-portion.component.html',
  styleUrls: ['./edit-portion.component.css']
})
export class EditPortionComponent implements OnInit, OnDestroy {

  private id: string;
  private date: DateURL;
  private subscription: Subscription;

  public portion: Portion;
  public previewedPortion: Portion;

  public portionForm: FormGroup = new FormGroup({ quantity: new FormControl('', [Validators.required, Validators.maxLength(4)]) });

  constructor(private readonly planner: PlannerService, private route: ActivatedRoute) { }

  ngOnInit() {

    if (this.route.parent === null) {
      console.log('issue tk');
      return;
    }

    this.subscription = this.route.params.pipe(switchMap(params => {

      if (this.route.parent === null)
        return of();

      const dateParams = this.route.parent.snapshot.params;

      this.id = params.portionID;
      this.date = { year: dateParams.year, month: dateParams.month, day: dateParams.day };

      return this.planner.getPortion(this.id, this.date);
    }
    )).subscribe(portion => {
      if (portion === undefined)
        return;

      this.portion = portion;
      this.previewedPortion = portion;
      this.portionForm.setValue({ quantity: this.portion.quantity });

    });

    const quantityControl = this.portionForm.get('quantity');
    if (quantityControl === null)
      return;
    this.subscription.add(quantityControl.valueChanges.subscribe((newQuantity: number) => {
      this.previewedPortion = new Portion(this.portion.id, newQuantity, this.portion.food, this.portion.mealID);
    }));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private changePortion(): void {
    const { id, foodID, mealID, quantity } = this.previewedPortion;
    this.planner.changePortion(this.date, { id, foodID, mealID, quantity: this.portion.quantity }, { id, foodID, mealID, quantity });
  }

}
