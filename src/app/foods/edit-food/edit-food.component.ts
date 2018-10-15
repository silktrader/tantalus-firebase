import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormControl } from '@angular/forms';
import { FoodsService } from '../../foods.service';
import { Food } from '../food';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-edit-food',
  templateUrl: './edit-food.component.html',
  styleUrls: ['./edit-food.component.css'],
})
export class EditFoodComponent implements OnInit {

  addFoodForm = new FormGroup({
    name: new FormControl(''),
    brand: new FormControl(''),
    proteins: new FormControl(''),
    carbs: new FormControl(''),
    fats: new FormControl('')
  });

  food$: Observable<Food>;
  private food: Food;

  constructor(private foodsService: FoodsService, private location: Location, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.food$ = this.activatedRoute.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.foodsService.getFood(params.get('id')))
    );

    this.food$.subscribe(food => {
      this.addFoodForm.patchValue(food);
      this.food = food;
    });
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
    this.location.back();
  }

  onDiscard() {
    this.location.back();
  }

}
