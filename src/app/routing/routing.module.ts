import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CalendarComponent } from '../calendar/calendar.component';
import { LoginComponent } from '../auth/login/login.component';
import { AuthGuard } from '../auth/auth.guard';
import { FoodsComponent } from '../foods/foods.component';
import { DiaryComponent } from '../diary/diary.component';
import { AddFoodComponent } from '../foods/add-food/add-food.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'calendar', component: CalendarComponent, canActivate: [AuthGuard] },
  { path: 'foods', component: FoodsComponent, canActivate: [AuthGuard] },
  { path: 'addfood', component: AddFoodComponent, canActivate: [AuthGuard] },
  { path: 'diary', component: DiaryComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/foods', pathMatch: 'full' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class RoutingModule { }
