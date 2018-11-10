import { Injectable } from '@angular/core';
import { MatSidenav, MatDrawerToggleResult } from '@angular/material';

@Injectable({ providedIn: 'root' })
export class UiService {

  private sidenav: MatSidenav;

  constructor() { }

  public setSidenav(sidenav: MatSidenav) {
    this.sidenav = sidenav;
  }

  public openSidenav(): Promise<MatDrawerToggleResult> {
    return this.sidenav.open();
  }
}
