import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { Food } from './food';
import { FoodsService } from '../foods.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-foods',
  templateUrl: './foods.component.html',
  styleUrls: ['./foods.component.css']
})
export class FoodsComponent implements OnInit, AfterViewInit {

  displayedColumns = ['name', 'proteins', 'carbs', 'fats', 'calories'];
  dataSource = new MatTableDataSource<Food>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private foodsService: FoodsService) { }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.foodsService.foods.subscribe(
      (foods) => { this.dataSource.data = foods },
      (error) => console.log(error));
  }

  doFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
