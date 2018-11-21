import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class CalendarService {

  constructor(private router: Router) { }

  public get today(): Date {
    return new Date();
  }

  public get yesterday(): Date {
    const date = this.today;
    date.setDate(date.getDate() - 1);
    return date;
  }

  public get tomorrow(): Date {
    const date = this.today;
    date.setDate(date.getDate() + 1);
    return date;
  }

  public gotoDate(date: Date) {
    this.router.navigate([`diary/${date.getFullYear()}/${+date.getMonth() + 1}/${date.getDate()}`]);
  }
}
