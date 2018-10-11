import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormControl } from '@angular/forms';
import { FoodsService } from '../../foods.service';
import { Router } from '@angular/router';

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

  constructor(private foodsService: FoodsService, private location: Location, private router: Router) { }

  ngOnInit() {
  }

  onSubmit() {
    this.foodsService.AddFood(this.addFoodForm.value);
  }

  onDiscard() {
    this.location.back();
  }

}
