import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlannerService, DateURL } from '../planner.service';
import { ActivatedRoute } from '@angular/router';
import { Meal } from 'src/app/models/meal';
import { Portion } from 'src/app/models/portion';
import { Subscription, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { PortionQuantityValidator } from '../../validators/portion-quantity.validator';


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

  public quantitiesControl = new FormControl('', [Validators.required, PortionQuantityValidator]);

  public portionForm: FormGroup = new FormGroup(
    { quantity: this.quantitiesControl });

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
      this.quantitiesControl.setValue(this.portion.quantity);

    });

    this.subscription.add(this.quantitiesControl.valueChanges.subscribe((newQuantity: number) => {
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

  private resetQuantity(): void {
    this.quantitiesControl.reset(this.portion.quantity);
    this.previewedPortion = this.portion;
  }

  getQuantitiesControlError() {
    if (this.quantitiesControl.hasError('required'))
      return 'Required';
    if (this.quantitiesControl.hasError('integer'))
      return 'No decimals';
    if (this.quantitiesControl.hasError('range'))
      return 'Must be within [0, 5,000] grams';
    return '';
  }

}
