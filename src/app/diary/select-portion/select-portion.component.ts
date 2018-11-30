import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { FoodsService } from 'src/app/foods/foods.service';
import { Food } from 'src/app/foods/shared/food';
import { PlannerService } from '../planner.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Meal } from 'src/app/models/meal';
import { UiService } from 'src/app/ui.service';

@Component({
  selector: 'app-select-portion',
  templateUrl: './select-portion.component.html',
  styleUrls: ['./select-portion.component.css']
})
export class SelectPortionComponent implements OnInit, OnDestroy {

  public filteredFoods$: Observable<Food[]>;
  startAt$: BehaviorSubject<string> = new BehaviorSubject('');

  public mealSelector: FormControl = new FormControl();
  public searchBox: FormControl = new FormControl();

  private subscription = new Subscription();

  constructor(private foodsService: FoodsService, public planner: PlannerService, private ui: UiService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {

    this.filteredFoods$ = this.foodsService.getFilteredFoods(this.startAt$);

    if (this.route.parent === null) {
      console.log('ERROR');
      return; // tk throw error warn user about wrong URL
    }

    this.mealSelector.setValue(this.planner.focusedMeal);

    this.subscription.add(this.mealSelector.valueChanges.subscribe(value => this.planner.focusedMeal = value));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  public get availableMeals(): ReadonlyArray<number> {
    return Meal.mealIDs;
  }

  public back(): void {
    this.ui.goBack();
  }

  public search($event): void {
    this.startAt$.next($event.target.value);
  }

  public resetSearch(): void {
    this.searchBox.setValue('');
    this.startAt$.next('');
  }

  public startFoodCreation(): void {
    this.router.navigate(['/add-food'], { queryParams: { name: this.searchBox.value } });
  }

  public proceedWithSelection(food: Food): void {
    this.router.navigate([food.id], { relativeTo: this.route });
  }
}
