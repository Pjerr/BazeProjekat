import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Output() toggleSidebar: EventEmitter<boolean> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }
  areCategoriesShown : boolean = false
  toggleCategories():void {
    this.areCategoriesShown = !this.areCategoriesShown;
    this.toggleSidebar.emit(this.areCategoriesShown);
  }
}
