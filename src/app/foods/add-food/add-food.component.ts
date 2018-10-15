import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormControl } from '@angular/forms';
import { FoodsService } from '../../foods.service';
import { Food } from '../food';

@Component({
  selector: 'app-add-food',
  templateUrl: './add-food.component.html',
  styleUrls: ['./add-food.component.css'],
})
export class AddFoodComponent implements OnInit {

  addFoodForm = new FormGroup({
    name: new FormControl(''),
    brand: new FormControl(''),
    proteins: new FormControl(''),
    carbs: new FormControl(''),
    fats: new FormControl('')
  });

  constructor(private foodsService: FoodsService, private location: Location) { }

  ngOnInit() { }

  onSubmit() {
    const form = this.addFoodForm.value;
    this.foodsService.addFood({
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
