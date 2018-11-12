import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { FoodsService } from 'src/app/foods.service';
import { Food } from 'src/app/foods/food';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material';
import { AddPortionDialogComponent, AddPortionDialogData } from '../add-portion-dialog/add-portion-dialog.component';
import { PlannerService, DateYMD } from '../planner.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as shortid from 'shortid';

@Component({
  selector: 'app-select-portion',
  templateUrl: './select-portion.component.html',
  styleUrls: ['./select-portion.component.css']
})
export class SelectPortionComponent implements OnInit {

  searchBox: FormControl = new FormControl();

  filteredFoods$: Observable<Food[]>;
  startAt$: BehaviorSubject<string> = new BehaviorSubject('');

  private dateURL: DateYMD;

  constructor(private readonly foodsService: FoodsService, private readonly plannerService: PlannerService,
    private dialog: MatDialog, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {

    this.filteredFoods$ = this.foodsService.getFilteredFoods(this.startAt$);

    if (this.route.parent === null) {
      console.log('ERROR');
      return; // tk throw error warn user about wrong URL
    }

    this.route.parent.params.subscribe(params => {
      this.dateURL = { year: params.year, month: params.month, day: params.day };
    });
  }

  public get title(): string {
    const date = new Date(this.dateURL.year, this.dateURL.month, this.dateURL.day);
    return `New portions for ${date.toLocaleDateString()}`;
  }

  public back(): void {
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  search($event): void {
    let inputText = $event.target.value;
    inputText = inputText.toLowerCase();
    this.startAt$.next(inputText);
  }

  // openPortionDialog(food: Food): void {

  //   const dialog = this.dialog.open(AddPortionDialogComponent, {
  //     data: {
  //       food: food,
  //       currentMeals$: this.plannerService.getRecordedMeals(this.dateURL),
  //     }
  //   });

  //   dialog.afterClosed().subscribe((data: AddPortionDialogData) => {
  //     if (data === undefined)
  //       return;
  //     this.selectedPortions.push({ food: data.food, quantity: data.quantity, mealID: data.mealID });
  //   });
  // }

  // deletePortion(portionData: AddPortionDialogData): void {
  //   this.selectedPortions.splice(this.selectedPortions.indexOf(portionData), 1);
  // }

  // registerPortions() {
  //   for (let i = 0; i < this.selectedPortions.length; i++) {
  //     const data = this.selectedPortions[i];
  //     this.plannerService.addPortion(this.dateURL, { id: shortid.generate(), foodID: data.food.id, quantity: data.quantity, mealID: data.mealID });
  //     // tk move shortid into service
  //   }

  //   this.back();
  // }
}
