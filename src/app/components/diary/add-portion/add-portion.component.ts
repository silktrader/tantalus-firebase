import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { FoodsService } from 'src/app/foods.service';

@Component({
  selector: 'app-add-portion',
  templateUrl: './add-portion.component.html',
  styleUrls: ['./add-portion.component.css']
})
export class AddPortionComponent implements OnInit {

  searchBox: FormControl = new FormControl();

  filteredFoods;
  startAt: BehaviorSubject<string | null> = new BehaviorSubject('');

  constructor(private readonly foodsService: FoodsService) { }

  ngOnInit() {
    this.filteredFoods = this.foodsService.getFilteredFoods(this.startAt);
  }

  search($event) {
    let inputText = $event.target.value;
    inputText = inputText.toLowerCase();
    this.startAt.next(inputText);
  }

}
