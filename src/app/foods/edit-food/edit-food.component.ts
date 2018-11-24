import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FoodsService } from '../../foods.service';
import { Food } from '../food';
import { Subscription, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { UiService } from 'src/app/ui.service';

@Component({
  selector: 'app-edit-food',
  templateUrl: './edit-food.component.html',
  styleUrls: ['./edit-food.component.css'],
})
export class EditFoodComponent implements OnInit, OnDestroy {

  addFoodForm = new FormGroup({
    name: new FormControl(),
    brand: new FormControl(),
    proteins: new FormControl(),
    carbs: new FormControl(),
    fats: new FormControl()
  });

  public food: Food | undefined;
  private subscription: Subscription;

  constructor(private foodsService: FoodsService, private ui: UiService, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.subscription = this.activatedRoute.paramMap.pipe(
      switchMap((params: ParamMap) => {
        const id = params.get('id');
        if (id === null)
          return of(undefined);
        return this.foodsService.getFood(id);
      })).subscribe(food => {
        this.food = food;
        if (food === undefined)
          return;

        this.addFoodForm.patchValue(food);
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onSubmit() {

    if (this.food === undefined)
      return;

    const form = this.addFoodForm.value;
    this.foodsService.editFood({
      id: this.food.id,
      name: form.name,
      brand: form.brand,
      proteins: +form.proteins || 0,
      carbs: +form.carbs || 0,
      fats: +form.fats || 0,
    });

    this.ui.goBack();
  }

  onDelete() {

    if (this.food === undefined)
      return; // tk?
    this.foodsService.deleteFood(this.food).then(() => this.ui.goBack());
  }

  onDiscard() {
    this.ui.goBack();
  }

  public get editable() {
    return this.food !== undefined;
  }

}
