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
import { NavigationComponent } from './navigation/navigation.component';
import { DiarySummaryComponent } from './diary/diary-summary/diary-summary.component';
import { AddFoodComponent } from './foods/add-food/add-food.component';
import { EditFoodComponent } from './foods/edit-food/edit-food.component';
import { AddPortionComponent } from './diary/add-portion/add-portion.component';
import { DiaryOutletComponent } from './diary/diary-outlet/diary-outlet.component';
import { AddPortionDialogComponent } from './diary/add-portion-dialog/add-portion-dialog.component';
import { EditPortionComponent } from './diary/edit-portion/edit-portion.component';

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        CalendarComponent,
        FoodsComponent,
        SignoutComponent,
        NavigationComponent,
        DiarySummaryComponent,
        AddFoodComponent,
        EditFoodComponent,
        AddPortionComponent,
        DiaryOutletComponent,
        AddPortionDialogComponent,
        EditPortionComponent,
    ],
    imports: [
        BrowserModule,
        RoutingModule,
        FormsModule,
        ReactiveFormsModule,
        AngularFireModule.initializeApp(environment.firebase),
        CoreModule,
        BrowserAnimationsModule,
        MaterialModule,
    ],
    entryComponents: [
        AddPortionDialogComponent
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
