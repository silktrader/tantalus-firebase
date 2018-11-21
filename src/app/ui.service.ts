import { Injectable } from '@angular/core';
import { MatSidenav, MatDrawerToggleResult, MatSnackBar } from '@angular/material';
import { Location } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class UiService {

  private sidenav: MatSidenav;

  constructor(private snackBar: MatSnackBar, private location: Location) { }

  public setSidenav(sidenav: MatSidenav) {
    this.sidenav = sidenav;
  }

  public openSidenav(): Promise<MatDrawerToggleResult> {
    return this.sidenav.open();
  }

  public notify(message: string, actionName: string, actionFunction: () => void) {
    const snackBarRef = this.snackBar.open(message, actionName, {
      duration: 3000
    });
    snackBarRef.onAction().subscribe(actionFunction);
  }

  public warn(message: string) {
    this.snackBar.open(message, '', { duration: 3000 });
  }

  public goBack() {
    this.location.back();
  }
}
