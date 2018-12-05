import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { RoutingModule } from './routing/routing.module';
import { LoginComponent } from './auth/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarComponent } from './calendar/calendar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MaterialModule } from './material/material.module';
import { FoodsComponent } from './foods/foods.component';
import { SignoutComponent } from './auth/signout/signout.component';
import { DiarySummaryComponent } from './diary/diary-summary/diary-summary.component';
import { EditFoodComponent } from './foods/edit-food/edit-food.component';
import { SelectPortionComponent } from './diary/select-portion/select-portion.component';
import { DiaryOutletComponent } from './diary/diary-outlet/diary-outlet.component';
import { AddPortionComponent } from './diary/add-portion/add-portion.component';
import { EditPortionComponent } from './diary/edit-portion/edit-portion.component';
import { DeleteFoodDialogComponent } from './foods/delete-food-dialog/delete-food-dialog.component';
import { LayoutModule } from '@angular/cdk/layout';

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        CalendarComponent,
        FoodsComponent,
        SignoutComponent,
        DiarySummaryComponent,
        EditFoodComponent,
        SelectPortionComponent,
        DiaryOutletComponent,
        AddPortionComponent,
        EditPortionComponent,
        DeleteFoodDialogComponent,
    ],
    imports: [
        BrowserModule,
        LayoutModule,
        RoutingModule,
        FormsModule,
        ReactiveFormsModule,
        AngularFireModule.initializeApp(environment.firebase),
        CoreModule,
        BrowserAnimationsModule,
        MaterialModule,
    ],
    entryComponents: [
        DeleteFoodDialogComponent
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
