import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { FoodsService } from 'src/app/foods.service';
import { Food } from 'src/app/foods/food';
import { Observable, Subscription } from 'rxjs';
import { PlannerService } from '../planner.service';
import { ActivatedRoute, Router } from '@angular/router';

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

  public mealNumbers: number[] = [];

  private subscription = new Subscription();

  constructor(private readonly foodsService: FoodsService, public readonly planner: PlannerService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {

    this.filteredFoods$ = this.foodsService.getFilteredFoods(this.startAt$);

    if (this.route.parent === null) {
      console.log('ERROR');
      return; // tk throw error warn user about wrong URL
    }

    this.mealSelector.setValue(this.planner.focusedMeal);

    this.subscription.add(this.mealSelector.valueChanges.subscribe(value => this.planner.focusedMeal = value));
    this.subscription.add(this.planner.getPortionsNumber().subscribe(mealNumbers => {
      this.mealNumbers = mealNumbers;
    }));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  public get availableMeals(): ReadonlyArray<number> {
    return PlannerService.availableMealsIDS;
  }

  public back(): void {
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  public search($event): void {
    this.startAt$.next($event.target.value);
  }

  public resetSearch(): void {
    this.searchBox.setValue('');
    this.startAt$.next('');
  }

  public startFoodCreation(): void {
    this.router.navigate(['/addfood']);
  }

  public proceedWithSelection(food: Food): void {
    this.router.navigate([food.id], { relativeTo: this.route });
  }
}
