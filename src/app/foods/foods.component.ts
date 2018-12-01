import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { Food } from './shared/food';
import { FoodsService } from './foods.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { UiService } from '../ui.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-foods',
  templateUrl: './foods.component.html',
  styleUrls: ['./foods.component.css'],
})
export class FoodsComponent implements OnInit, OnDestroy, AfterViewInit {

  constructor(private foodsService: FoodsService, public uiService: UiService, private router: Router) { }

  displayedColumns = ['name', 'proteins', 'carbs', 'fats', 'calories'];
  selectedColumns = ['name', 'calories'];

  private readonly availableColumnSets = new Map<string, Array<string>>([
    ['Calories', ['calories']],
    ['Macronutrients', ['proteins', 'carbs', 'fats']]
  ]);

  public readonly columnNames = new Map<string, string>([
    ['name', 'Name'],
    ['calories', 'Calories'],
    ['proteins', 'Proteins'],
    ['carbs', 'Carbs'],
    ['fats', 'Fats']
  ]);

  public columnSelector = new FormControl();

  public dataSource: MatTableDataSource<Food> = new MatTableDataSource<Food>();
  private subscription = new Subscription();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  private readonly integerProperties = new Set(['calories', 'proteins', 'carbs', 'fats']);

  // might have to use AfterViewInit
  ngOnInit(): void {
    this.subscription.add(this.foodsService.foods$.subscribe((foods: Food[]) => this.dataSource.data = foods));

    // sets up the colums selector and specify a default value
    this.subscription.add(this.columnSelector.valueChanges.subscribe(value => this.selectedColumns = this.selectColumns(value)));
    this.columnSelector.setValue('Calories');
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  doFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  edit(food: Food): void {
    this.router.navigate(['/food', food.id]);
  }

  public format(name: string, item: any): string {

    if (typeof item !== 'number')
      return item;

    if (this.integerProperties.has(name))
      return this.formatInteger(item);

    return 'na';
  }

  private formatInteger(number: number): string {
    return number.toLocaleString(undefined, { maximumFractionDigits: 0 });
  }

  private selectColumns(key: string): Array<string> {
    return ['name', ...this.availableColumnSets.get(key) || ['calories']];
  }
}
