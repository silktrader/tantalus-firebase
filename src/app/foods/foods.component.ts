import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { Food } from './food';
import { FoodsService } from '../foods.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-foods',
  templateUrl: './foods.component.html',
  styleUrls: ['./foods.component.css']
})
export class FoodsComponent implements OnInit, OnDestroy {

  displayedColumns = ['name', 'proteins', 'carbs', 'fats', 'calories'];
  dataSource = new MatTableDataSource<Food>();
  private dataSubscription: Subscription;

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
}
