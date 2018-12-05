import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FoodsService } from '../foods.service';
import { Food, FoodData } from '../shared/food';
import { Subscription, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { UiService } from 'src/app/ui.service';
import { MatDialog } from '@angular/material';
import { DeleteFoodDialogComponent } from '../delete-food-dialog/delete-food-dialog.component';
import { IDiaryEntryData } from 'src/app/diary/planner.service';
import { Portion } from 'src/app/models/portion';

@Component({
  selector: 'app-edit-food',
  templateUrl: './edit-food.component.html',
  styleUrls: ['./edit-food.component.css'],
})
export class EditFoodComponent implements OnInit, OnDestroy {

  addFoodForm = new FormGroup({
    name: new FormControl(),
    proteins: new FormControl(),
    carbs: new FormControl(),
    fats: new FormControl(),
    fibres: new FormControl(),
    sugar: new FormControl(),
    starch: new FormControl(),
    saturated: new FormControl(),
    trans: new FormControl(),
    cholesterol: new FormControl(),
    sodium: new FormControl(),
    potassium: new FormControl(),
    calcium: new FormControl(),
    magnesium: new FormControl(),
    zinc: new FormControl(),
    iron: new FormControl(),
    notes: new FormControl(),
    source: new FormControl(),
  });

  public food: Food | undefined;

  private subscription: Subscription;
  private _addition: boolean;

  public get addition(): boolean {
    return this._addition;
  }

  constructor(private foodsService: FoodsService, private ui: UiService, private route: ActivatedRoute, private router: Router, public dialog: MatDialog) { }

  ngOnInit() {

    this._addition = this.route.snapshot.url[0].path === 'add-food';
    if (this._addition) {
      this.food = new Food({ id: this.foodsService.generateID(), name: 'New Food', proteins: 0, carbs: 0, fats: 0 });
      this.addFoodForm.patchValue(this.food);
      return;
    }

    this.subscription = this.route.paramMap.pipe(
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
    if (this.subscription)
      this.subscription.unsubscribe();
  }

  onSubmit(): void {

    // cache food to enable the undo action
    const food = this.food;
    if (food === undefined)
      return;

    // read new values, including name
    const form = this.addFoodForm.value;

    // changing the food entails different notifications
    if (this._addition)
      this.addFood(food, form);
    else this.changeFood(food, form);
  }

  private addFood(food: Food, values: FoodData): void {
    this.foodsService.editFood({ id: food.id, ...values }).then(() => {
      this.ui.notify(`Added ${values.name}`, 'View', () => {
        this.router.navigate(['/food', food.id]);
      });
      this.ui.goBack();
    });
  }

  private changeFood(food: Food, values: FoodData): void {
    this.foodsService.editFood({ id: food.id, ...values }).then(() => {
      this.ui.notify(`Changed ${values.name}`, 'Undo', () => {
        this.foodsService.editFood(food.deserialised);
        this.ui.warn(`Reverted changes to ${food.name}`);
      });
      this.ui.goBack();
    });
  }

  onDelete() {

    const dialogRef = this.dialog.open(DeleteFoodDialogComponent, {
      data: { food: this.food },
    });

    dialogRef.afterClosed().subscribe((result: { documents: Array<IDiaryEntryData>, portions: Array<{ date: string, portion: Portion }> }) => {
      if (result && this.food) {
        const food = this.food;     // undefined scoped check
        this.foodsService.deleteFood(food, result.documents).then(() => {
          this.ui.warn(`Deleted ${food.name} and its ${result.portions.length} portions`);
        });
      }
    });
  }

  public get editable() {
    return this.food !== undefined;
  }

  public get deletable() {
    return this.editable;
  }

}
