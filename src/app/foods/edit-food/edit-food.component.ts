import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormControl } from '@angular/forms';
import { FoodsService } from '../../foods.service';
import { Food } from '../food';
import { Observable, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-edit-food',
  templateUrl: './edit-food.component.html',
  styleUrls: ['./edit-food.component.css'],
})
export class EditFoodComponent implements OnInit, OnDestroy {

  addFoodForm = new FormGroup({
    name: new FormControl(''),
    brand: new FormControl(''),
    proteins: new FormControl(''),
    carbs: new FormControl(''),
    fats: new FormControl('')
  });

  food$: Observable<Food>;
  private food: Food | null;
  private subscription: Subscription;

  constructor(private foodsService: FoodsService, private location: Location, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.food$ = this.activatedRoute.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.foodsService.getFood(params.get('id')))
    );

    this.subscription = this.food$.subscribe(food => {
      this.addFoodForm.patchValue(food);
      this.food = food;
    });
  }

  ngOnDestroy(): void {
    this.food = null;
    this.subscription.unsubscribe();
  }

  onSubmit() {
    const form = this.addFoodForm.value;
    this.foodsService.editFood(this.food.id, {
      name: form.name,
      brand: form.brand,
      proteins: +form.proteins || 0,
      carbs: +form.carbs || 0,
      fats: +form.fats || 0,
    });

    this.food = null;
    this.subscription.unsubscribe();

    this.location.back();
  }

  onDelete() {

    this.foodsService.deleteFood(this.food).then(() => this.router.navigate(['foods']));
  }

  onDiscard() {
    this.location.back();
  }

}
