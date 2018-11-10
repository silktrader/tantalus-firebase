import { Component, OnInit, ViewChild } from '@angular/core';
import { UiService } from './ui.service';
import { MatSidenav } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild('sidenav') public sidenav: MatSidenav;
  title = 'tantalus';

  constructor(private uiService: UiService) { }

  ngOnInit() {
    this.uiService.setSidenav(this.sidenav);
  }
}
