import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'BazeProjekat';

  constructor() {}

  isSidebarShown: boolean = false;

  toggleSidebar(sidebarState: boolean) : void{
    this.isSidebarShown = sidebarState;
  }
}
