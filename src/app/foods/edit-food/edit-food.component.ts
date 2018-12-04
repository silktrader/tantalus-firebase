import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FoodsService } from '../foods.service';
import { Food } from '../shared/food';
import { Subscription, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ActivatedRoute, ParamMap } from '@angular/router';
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
    saturated: new FormControl(),
    trans: new FormControl(),
    cholesterol: new FormControl(),
    sodium: new FormControl()
  });

  public food: Food | undefined;
  private subscription: Subscription;

  constructor(private foodsService: FoodsService, private ui: UiService, private activatedRoute: ActivatedRoute, public dialog: MatDialog) { }

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

  onSubmit(): void {

    // cache food to enable the undo action
    const food = this.food;
    if (food === undefined)
      return;

    // read new values, including name
    const form = this.addFoodForm.value;

    this.foodsService.editFood({ id: food.id, ...form }).then(() => {
      this.ui.notify(`Changed ${form.name}`, 'Undo', () => {
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

  onDiscard() {
    this.ui.goBack();
  }

  public get editable() {
    return this.food !== undefined;
  }

  public get deletable() {
    return this.editable;
  }

}
