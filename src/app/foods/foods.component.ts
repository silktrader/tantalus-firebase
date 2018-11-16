import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { Food } from './food';
import { FoodsService } from '../foods.service';
import { Observable, Subscription } from 'rxjs';
import { distinct } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-foods',
  templateUrl: './foods.component.html',
  styleUrls: ['./foods.component.css'],
})
export class FoodsComponent implements OnInit, OnDestroy, AfterViewInit {

  displayedColumns = ['name', 'proteins', 'carbs', 'fats', 'calories'];
  public dataSource: MatTableDataSource<Food> = new MatTableDataSource<Food>();
  private dataSubscription: Subscription;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private readonly foodsService: FoodsService, private readonly router: Router) { }

  // might have to use AfterViewInit
  ngOnInit(): void {
    this.dataSubscription = this.foodsService.foods$.subscribe((foods: Food[]) => this.dataSource.data = foods);
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy(): void {
    this.dataSubscription.unsubscribe();
  }

  doFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  edit(food: Food): void {
    this.router.navigate(['/food', food.id]);
  }
}
