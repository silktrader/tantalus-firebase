import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { Food } from './food';
import { FoodsService } from '../foods.service';
import { Observable, Subscription } from 'rxjs';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Router } from '@angular/router';

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
export class FoodsComponent implements OnInit, OnDestroy, AfterViewInit {

  displayedColumns = ['name', 'proteins', 'carbs', 'fats', 'calories'];
  private dataSource: MatTableDataSource<Food> = new MatTableDataSource<Food>();
  private dataSubscription: Subscription;

  foods$ = this.foodsService.foods$;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private readonly foodsService: FoodsService, private readonly router: Router) { }

  // might have to use AfterViewInit
  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.dataSubscription = this.foods$.subscribe((foods: Food[]) => this.dataSource.data = foods);

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
    this.router.navigate(['/food', food.id])
  }

  addstuff() {
    this.foodsService.addFood({
      name: "TEST",
      brand: "",
      proteins: 0,
      carbs: 0,
      fats: 0,
    });
  }
}
