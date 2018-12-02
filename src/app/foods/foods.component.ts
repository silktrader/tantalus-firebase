import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit, ElementRef, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, MatToolbar, MatButtonToggleGroup } from '@angular/material';
import { Food } from './shared/food';
import { FoodsService } from './foods.service';
import { Subscription, of, fromEvent } from 'rxjs';
import { map, debounceTime, switchMap, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UiService } from '../ui.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-foods',
  templateUrl: './foods.component.html',
  styleUrls: ['./foods.component.css'],
})
export class FoodsComponent implements OnInit, OnDestroy, AfterViewInit {

  constructor(private foodsService: FoodsService, public ui: UiService, private router: Router, private changeDetector: ChangeDetectorRef) { }

  selectedColumns = ['name', 'calories'];

  private readonly mobileColumnSets = new Map<string, Array<string>>([
    ['Calories', ['calories']],
    ['Macronutrients', ['proteins', 'carbs', 'fats']]
  ]);

  private readonly desktopColumnSets = new Map<string, Array<string>>([
    ['Overview', ['proteins', 'carbs', 'fats', 'calories']],
    ['Carbohydrates', ['carbs', 'fibres', 'sugar', 'carbsPercentage']]
  ]);

  public readonly columnNames = new Map<string, string>([
    ['name', 'Name'],
    ['calories', 'Calories'],
    ['proteins', 'Proteins'],
    ['carbs', 'Carbs'],
    ['fats', 'Fats'],
    ['fibres', 'Fibres'],
    ['sugar', 'Sugar'],
    ['carbsPercentage', 'Calories %']
  ]);

  public columnSelector = new FormControl();
  @ViewChild(MatButtonToggleGroup) public columnToggle: MatButtonToggleGroup;

  public dataSource: MatTableDataSource<Food> = new MatTableDataSource<Food>();
  private subscription = new Subscription();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild('tableControls') tableControls: ElementRef;
  @ViewChild(MatToolbar) toolbar: MatToolbar;

  private readonly integerProperties = new Set(['calories', 'proteins', 'carbs', 'fats']);
  private readonly oneDecimalProperties = new Set(['fibres', 'sugar']);
  private readonly percentageProperties = new Set(['carbsPercentage']);

  public desktop = false;

  // might have to use AfterViewInit
  ngOnInit(): void {
    this.subscription.add(this.foodsService.foods$.subscribe((foods: Food[]) => this.dataSource.data = foods));

    // sets up the colums selector and specify a default value
    // this.subscription.add(this.ui.mobile.subscribe(() => {
    //   this.subscription.add(this.columnSelector.valueChanges.subscribe(value => this.selectedColumns = this.selectMobileColumns(value)));
    // }));

    this.ui.mobile.pipe(
      switchMap(isMobile => isMobile ? this.columnSelector.valueChanges : of(undefined)))
      .subscribe(value => {
        if (value === undefined)
          return;
        this.selectedColumns = this.selectMobileColumns(value);
      });

    this.ui.desktop.pipe(
      switchMap((isDesktop) => {
        if (!isDesktop) {
          this.desktop = false;
          return of(undefined);
        }

        this.desktop = true;
        this.changeDetector.detectChanges();
        this.columnToggle.value = 'Overview';
        this.selectedColumns = this.selectDesktopColumns(this.columnToggle.value);
        return this.columnToggle.valueChange.asObservable();
      }))
      .subscribe(value => {
        if (value === undefined)
          return;
        this.selectedColumns = this.selectDesktopColumns(value);
      });

    //   this.subscription.add(this.columnSelector.valueChanges.subscribe(value => this.selectedColumns = this.selectMobileColumns(value)));
    // }))

    // this.subscription.add(this.ui.desktop.subscribe)
    // this.subscription.add(this.columnToggle.valueChange.subscribe(value => this.selectedColumns = this.selectDesktopColumns(value)));

    this.columnSelector.setValue('Calories');
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    // listen to height changes
    const $resizeEvent = fromEvent(window, 'resize').pipe(
      map(() => {
        if (document && document.documentElement)
          return document.documentElement.clientHeight;
        return 800;
      }),
      debounceTime(200));

    // possibly unnecessary subscription registration
    this.subscription.add($resizeEvent.subscribe((data: number) => {
      this.paginator._changePageSize(this.calculateRowsNumber(data));
    }));

    // set the initial page size
    if (document && document.documentElement)
      this.paginator.pageSize = this.calculateRowsNumber(document.documentElement.clientHeight);
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

    if (typeof item === 'number') {

      if (this.integerProperties.has(name))
        return item.toLocaleString(undefined, { maximumFractionDigits: 0 });

      if (this.oneDecimalProperties.has(name))
        return item.toLocaleString(undefined, { maximumFractionDigits: 1 });

      if (this.percentageProperties.has(name))
        return item.toLocaleString(undefined, { style: 'percent' });
    }

    if (typeof item === 'undefined')
      return '';

    return item;
  }

  private selectMobileColumns(key: string): Array<string> {
    return ['name', ...this.mobileColumnSets.get(key) || []];
  }

  public selectDesktopColumns(key: string): Array<string> {
    return ['name', ...this.desktopColumnSets.get(key) || []];
  }

  private calculateRowsNumber(availableHeight: number): number {

    // less than ideal calculations due to tight coupling with rendering layer
    const tableControlsHeight = (this.tableControls.nativeElement as HTMLElement).offsetHeight;
    const toolbarHeight = this.toolbar._elementRef.nativeElement.offsetHeight;
    const headerHeight = 56;
    const rowHeight = 50;
    const paginatorHeight = 56;
    return Math.floor((availableHeight - tableControlsHeight - toolbarHeight - headerHeight - paginatorHeight) / rowHeight);
  }
}
