import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormControl } from '@angular/forms';
import { FoodsService } from '../../foods.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-food',
  templateUrl: './add-food.component.html',
  styleUrls: ['./add-food.component.css'],
})
export class AddFoodComponent implements OnInit, OnDestroy {

  addFoodForm = new FormGroup({
    name: new FormControl(''),
    brand: new FormControl(''),
    proteins: new FormControl(''),
    carbs: new FormControl(''),
    fats: new FormControl('')
  });

  private subscription = new Subscription();

  constructor(private foodsService: FoodsService, private location: Location, private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.subscription = this.route.queryParams.subscribe(params => {
      this.addFoodForm.patchValue({ name: params['name'] });
    });

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onSubmit(): void {
    const form = this.addFoodForm.value;
    this.foodsService.addFood(form);

    this.location.back();
  }

  onDiscard() {
    this.location.back();
  }

}
