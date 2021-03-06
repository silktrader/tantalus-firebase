import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlannerService, DateYMD } from '../planner.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Portion } from 'src/app/models/portion';
import { Subscription, combineLatest, of } from 'rxjs';
import { switchMap, map, take, shareReplay } from 'rxjs/operators';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { PortionQuantityValidator } from '../../validators/portion-quantity.validator';
import { UiService } from 'src/app/ui.service';
import { DiaryEntry } from 'src/app/models/diary-entry';


@Component({
  selector: 'app-edit-portion',
  templateUrl: './edit-portion.component.html',
  styleUrls: ['./edit-portion.component.css']
})
export class EditPortionComponent implements OnInit, OnDestroy {

  private id: string;
  private subscription: Subscription;

  public originalPortion: Portion;
  public previewedPortion: Portion;

  public quantitiesControl = new FormControl('', [Validators.required, PortionQuantityValidator]);
  public mealSelector = new FormControl();

  constructor(private readonly planner: PlannerService, private route: ActivatedRoute, private router: Router, private ui: UiService) { }

  ngOnInit() {

    if (this.route.parent === null) {
      console.log('issue tk');
      return;
    }

    this.subscription = this.route.params.pipe(take(1), switchMap(params => {
      this.id = params.portionID;
      // the switch to this observable is needed to avoid accessing getPortion before the diary is populated
      return this.planner.diaryEntry;
    })).subscribe(diaryEntry => {
      const portion = diaryEntry.getPortion(this.id);
      if (portion === undefined)
        return;

      this.originalPortion = portion;
      this.previewedPortion = new Portion(portion.id, portion.quantity, portion.food, portion.mealID);
      this.quantitiesControl.setValue(this.originalPortion.quantity);
      this.mealSelector.setValue(this.originalPortion.mealID);
    });

    this.subscription.add(this.quantitiesControl.valueChanges.subscribe((newQuantity: number) => {
      this.previewedPortion = new Portion(this.originalPortion.id, newQuantity, this.previewedPortion.food, this.previewedPortion.mealID);
    }));

    this.subscription.add(this.mealSelector.valueChanges.subscribe((newMealID: number) => {
      this.previewedPortion = new Portion(this.originalPortion.id, this.previewedPortion.quantity, this.previewedPortion.food, newMealID);
    }));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  get saveDisabled(): boolean {
    return (!this.quantitiesControl.valid && !this.mealSelector.valid) ||
      (this.quantitiesControl.value === this.originalPortion.quantity && this.mealSelector.value === this.originalPortion.mealID);
  }

  get portionUnchanged(): boolean {
    return !this.quantitiesControl.dirty && this.mealSelector.value === this.originalPortion.mealID;
  }

  get hasPortion(): boolean {
    return this.originalPortion !== undefined;
  }

  get title(): string {
    return 'Edit Portion';
  }

  public back(): void {
    this.router.navigate(['../..'], { relativeTo: this.route });
  }

  public reset(): void {
    this.quantitiesControl.reset(this.originalPortion.quantity);
    this.mealSelector.reset(this.originalPortion.mealID);
    this.previewedPortion = this.originalPortion;
  }

  public save(): void {
    this.changePortion(this.originalPortion, this.previewedPortion);

    // navigate here to avoid multiple components reload on undoing actions
    this.back();
  }

  public delete(): void {
    const { id, foodID, mealID, quantity } = this.originalPortion;
    this.planner.removePortion({ id, foodID, mealID, quantity }).then(() => {
      this.notifyDeletedPortion(this.originalPortion);
      this.back();
    });
  }

  private checkPreview(preview: string): string {
    return this.quantitiesControl.valid ? preview : '…';
  }

  public get previewCalories(): string {
    return this.checkPreview(this.previewedPortion.calories.toFixed(0) + ' kcal');
  }

  public get previewProteins(): string {
    return this.checkPreview(this.previewedPortion.proteins.toFixed(1) + ' g.');
  }

  public get previewCarbs(): string {
    return this.checkPreview(this.previewedPortion.carbs.toFixed(1) + ' g.');
  }

  public get previewFats(): string {
    return this.checkPreview(this.previewedPortion.fats.toFixed(1) + ' g.');
  }

  private changePortion(initial: Portion, final: Portion): void {
    this.planner.changePortion(
      { id: final.id, foodID: final.foodID, mealID: final.mealID, quantity: final.quantity })
      .then(() => this.notifyChangePortion(initial, final));
  }

  private notifyChangePortion(initial: Portion, final: Portion) {
    const quantityDifference: number = final.quantity = initial.quantity;
    let message = `${initial.food.name}`;

    if (initial.mealID !== final.mealID) {
      message += ` moved to ${this.planner.getMealName(final.mealID)}`;
      if (quantityDifference !== 0)
        message += `, `;
    }

    if (quantityDifference > 0)
      message += ` increased by ${quantityDifference}g.`;
    else if (quantityDifference < 0)
      message += ` decreased by ${-quantityDifference}g.`;

    this.ui.notify(message, 'Undo', () => this.changePortion(final, initial));
  }

  private notifyDeletedPortion(portion: Portion) {
    this.ui.notify(`Removed ${portion.food.name}`, 'Undo', () => {
      // recreate old ID
      this.planner.addPortion({ id: portion.id, foodID: portion.food.id, quantity: portion.quantity, mealID: portion.mealID });
    });
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
