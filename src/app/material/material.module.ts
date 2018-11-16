import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatDatepickerModule,
  MatToolbarModule,
  MatSidenavModule,
  MatIconModule,
  MatListModule,
  MatTableModule,
  MatSortModule,
  MatPaginatorModule,
  MatSnackBarModule,
  MatCardModule,
  MatExpansionModule,
  MatTabsModule,
  MatDialogModule,
  MatButtonToggleModule,
  MatSelectModule,
  MatRippleModule,
  MatDividerModule
} from '@angular/material';
import { EcoFabSpeedDialModule } from '@ecodev/fab-speed-dial';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatSnackBarModule,
    MatCardModule,
    MatExpansionModule,
    EcoFabSpeedDialModule,
    MatTabsModule,
    MatDialogModule,
    MatButtonToggleModule,
    MatSelectModule,
    MatRippleModule,
    MatDividerModule
  ],
  exports: [
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatSnackBarModule,
    MatCardModule,
    MatExpansionModule,
    EcoFabSpeedDialModule,
    MatTabsModule,
    MatDialogModule,
    MatButtonToggleModule,
    MatSelectModule,
    MatRippleModule,
    MatDividerModule
  ],
  declarations: []
})
export class MaterialModule { }
