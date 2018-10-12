import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { Food } from './food';
import { FoodsService } from '../foods.service';
import { Observable, Subscription } from 'rxjs';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-foods',
  templateUrl: './foods.component.html',
  styleUrls: ['./foods.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*', marginTop: '10px', marginBottom: '10px' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class FoodsComponent implements OnInit, OnDestroy {

  displayedColumns = ['name', 'proteins', 'carbs', 'fats', 'calories'];
  dataSource = new MatTableDataSource<Food>();
  private dataSubscription: Subscription;
  expandedElement: Food;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private foodsService: FoodsService) { }

  // might have to use AfterViewInit
  ngOnInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSubscription = this.foodsService.foods.subscribe(
      foods => {
        this.dataSource.data = foods
      },
      error => console.log(error));
  }

  ngOnDestroy(): void {
    this.dataSubscription.unsubscribe();
  }

  doFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  toggleExpandedDetails(element: Food): void {
    this.expandedElement = this.expandedElement == element ? null : element;
  }

  delete(food: Food): void {
    this.foodsService.DeleteFood(food);
  }
}
