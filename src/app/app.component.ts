import { Component, OnInit, ViewChild } from '@angular/core';
import { UiService } from './ui.service';
import { MatSidenav } from '@angular/material';
import { CalendarService } from './calendar/calendar.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild('sidenav') public sidenav: MatSidenav;
  title = 'tantalus';

  constructor(private uiService: UiService, public calendar: CalendarService, private ui: UiService) { }

  ngOnInit() {
    this.uiService.setSidenav(this.sidenav);

    this.uiService.desktop.subscribe(isDesktop => {
      if (!isDesktop)
        return;

      this.sidenav.disableClose = true;
      this.sidenav.open();
      this.sidenav.mode = 'side';
    });

    this.uiService.mobile.subscribe(isMobile => {
      if (!isMobile)
        return;

      this.sidenav.disableClose = false;
      this.sidenav.close();
      this.sidenav.mode = 'over';
    });

  }
}
