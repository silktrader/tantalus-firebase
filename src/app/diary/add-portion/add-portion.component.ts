import { Component, OnInit, OnDestroy } from '@angular/core';
import { Food } from 'src/app/foods/food';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { PlannerService } from '../planner.service';
import { FoodsService } from 'src/app/foods.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Portion } from 'src/app/models/portion';
import { PortionQuantityValidator } from 'src/app/validators/portion-quantity.validator';
import { UiService } from 'src/app/ui.service';

@Component({
  selector: 'app-add-portion',
  templateUrl: './add-portion.component.html',
  styleUrls: ['./add-portion.component.css']
})
export class AddPortionComponent implements OnInit, OnDestroy {

  private subscription: Subscription;
  public food: Food;
  public previewedPortion: Portion;

  public quantitiesControl = new FormControl('', [Validators.required, PortionQuantityValidator]);
  public mealSelector = new FormControl('');

  public portionForm: FormGroup = new FormGroup(
    { quantity: this.quantitiesControl });

  public mealNumbers: number[] = [];

  constructor(private router: Router, private route: ActivatedRoute, private planner: PlannerService, private foodsService: FoodsService, private uiService: UiService) { }

  ngOnInit() {
    this.subscription = this.route.params.pipe(
      switchMap((params: Params) => {
        const foodID = params.foodID;
        return this.foodsService.getFood(foodID);
      })).subscribe(food => {
        this.previewedPortion = new Portion('', 100, food, 0);
        this.food = food;
      });

    this.subscription.add(this.planner.getPortionsNumber().subscribe(mealNumbers => {
      this.mealNumbers = mealNumbers;
    }));

    this.mealSelector.setValue(this.planner.focusedMeal);
    this.quantitiesControl.setValue(100);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
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

  public back(): void {
    this.router.navigate(['../..'], { relativeTo: this.route });
  }

  public get saveDisabled(): boolean {
    return this.quantitiesControl.invalid || this.mealSelector.invalid;
  }

  public save(): void {
    const portionData = { mealID: this.mealSelector.value, foodID: this.food.id, quantity: this.quantitiesControl.value };
    this.planner.addPortion(portionData).then((data) => {
      this.back();
      this.uiService.notify(`Added ${this.food.name}`, 'Undo', () => {
        this.planner.removePortion(data);
      });
    }).catch(error => {
      console.log(error);
      this.uiService.warn(`Couldn't record ${this.food.name}`);
    });
  }
}


