import { Component, OnInit, Input } from '@angular/core';
import { MaterialModule } from '../material/material.module';
import { MatIcon, MatSidenav } from '@angular/material';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public ToolbarTitle: string = "Tantalus";
  @Input() public Sidenav: MatSidenav;

  constructor() { }

  ngOnInit() {
  }

  ToggleSidenav() {
    this.Sidenav.toggle();
  }

}
