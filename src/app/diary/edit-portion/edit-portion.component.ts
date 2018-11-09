import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlannerService, DateURL } from '../planner.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Meal } from 'src/app/models/meal';
import { Portion } from 'src/app/models/portion';
import { Subscription, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { PortionQuantityValidator } from '../../validators/portion-quantity.validator';
import { MatSnackBar } from '@angular/material';


@Component({
  selector: 'app-edit-portion',
  templateUrl: './edit-portion.component.html',
  styleUrls: ['./edit-portion.component.css']
})
export class EditPortionComponent implements OnInit, OnDestroy {

  private id: string;
  private date: DateURL;
  private subscription: Subscription;

  public originalPortion: Portion;
  public previewedPortion: Portion;

  public quantitiesControl = new FormControl('', [Validators.required, PortionQuantityValidator]);

  public portionForm: FormGroup = new FormGroup(
    { quantity: this.quantitiesControl });

  constructor(private readonly planner: PlannerService, private route: ActivatedRoute, private router: Router, public snackBar: MatSnackBar) { }

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

      this.originalPortion = portion;
      this.previewedPortion = portion;
      this.quantitiesControl.setValue(this.originalPortion.quantity);

    });

    this.subscription.add(this.quantitiesControl.valueChanges.subscribe((newQuantity: number) => {
      this.previewedPortion = new Portion(this.originalPortion.id, newQuantity, this.originalPortion.food, this.originalPortion.mealID);
    }));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  get saveDisabled(): boolean {
    return !this.portionForm.valid || this.quantitiesControl.value === this.originalPortion.quantity;
  }

  save(): void {
    this.changePortion(this.originalPortion, this.previewedPortion);

    // navigate here to avoid multiple components reload on undoing actions
    this.router.navigate(['../..'], { relativeTo: this.route });
  }

  changePortion(initial: Portion, final: Portion): void {
    const { id, foodID, mealID } = initial;
    this.planner.changePortion(this.date,
      { id, foodID, mealID, quantity: initial.quantity },
      { id, foodID, mealID, quantity: final.quantity })
      .then(() => {
        this.notifyChangePortion(initial, final);
      });
  }

  private notifyChangePortion(initial: Portion, final: Portion) {
    const quantityDifference: number = initial.quantity - final.quantity;
    const message = (quantityDifference > 0) ?
      `Decreased ${initial.food.name}'s portion by ${quantityDifference}g.` :
      `Increased ${initial.food.name}'s portion by ${-quantityDifference}g.`;
    const snackBarRef = this.snackBar.open(message, 'Undo', {
      duration: 3000
    });
    snackBarRef.onAction().subscribe(() => {
      this.changePortion(final, initial);
    });
  }

  resetQuantity(): void {
    this.quantitiesControl.reset(this.originalPortion.quantity);
    this.previewedPortion = this.originalPortion;
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
