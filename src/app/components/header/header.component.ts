import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of, Subject, takeUntil } from 'rxjs';
import { AppState } from 'src/app/store/app.state';
import * as CommonSelectors from '../../store/common/common.selectors';
import * as CommonActions from '../../store/common/common.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  constructor(private store: Store<AppState>) {}

  sidebarStatus$: Observable<boolean> = of();
  sidebarStatus: boolean = false;
  
  destroy$: Subject<boolean> = new Subject<boolean>();

  //user definise da li je kupac ili prodavac ili admin
  user: string = 'a';

  ngOnInit(): void {
    this.sidebarStatus$ = this.store.select(
      CommonSelectors.selectSidebarStatus
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  toggleCategories(): void {
    this.sidebarStatus$.pipe(takeUntil(this.destroy$)).subscribe((status) => {
      this.sidebarStatus = !status;
    });
    this.store.dispatch(
      CommonActions.toggleSidebar({ sidebarStatus: this.sidebarStatus })
    );
  }

  logout(){
    console.log("should logout!");
  }
}
