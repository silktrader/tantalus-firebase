import { Injectable } from '@angular/core';
import { MatSidenav, MatDrawerToggleResult, MatSnackBar } from '@angular/material';
import { Location } from '@angular/common';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ReplaySubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UiService {

  private sidenav: MatSidenav;

  public mobile = new ReplaySubject<boolean>(1);
  public desktop = new ReplaySubject<boolean>(1);

  constructor(private snackBar: MatSnackBar, private location: Location, private breakpointObserver: BreakpointObserver) {
    this.breakpointObserver.observe(['(max-width: 959px', '(min-width: 960px)']).subscribe(result => {

      if (!result.matches)
        return;

      // update both breakpoints
      this.mobile.next(result.breakpoints['(max-width: 959px']);
      this.desktop.next(result.breakpoints['(min-width: 960px)']);
    });
  }

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
