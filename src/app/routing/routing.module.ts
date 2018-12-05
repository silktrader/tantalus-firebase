import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CalendarComponent } from '../calendar/calendar.component';
import { LoginComponent } from '../auth/login/login.component';
import { AuthGuard } from '../auth/auth.guard';
import { FoodsComponent } from '../foods/foods.component';
import { EditFoodComponent } from '../foods/edit-food/edit-food.component';
import { DiarySummaryComponent } from '../diary/diary-summary/diary-summary.component';
import { SelectPortionComponent } from '../diary/select-portion/select-portion.component';
import { DiaryOutletComponent } from '../diary/diary-outlet/diary-outlet.component';
import { EditPortionComponent } from '../diary/edit-portion/edit-portion.component';
import { AddPortionComponent } from '../diary/add-portion/add-portion.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'calendar', component: CalendarComponent, canActivate: [AuthGuard] },
  { path: 'foods', component: FoodsComponent, canActivate: [AuthGuard] },
  { path: 'add-food', component: EditFoodComponent, canActivate: [AuthGuard] },
  { path: 'food/:id', component: EditFoodComponent, canActivate: [AuthGuard] },
  {
    path: 'diary/:year/:month/:day', component: DiaryOutletComponent, canActivate: [AuthGuard],
    children: [
      { path: '', component: DiarySummaryComponent },
      { path: 'add-portion/:foodID', component: AddPortionComponent },
      { path: 'add-portion', component: SelectPortionComponent },
      { path: 'edit-portion/:portionID', component: EditPortionComponent }
    ]
  },

  { path: '', redirectTo: '/foods', pathMatch: 'full' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class RoutingModule { }
