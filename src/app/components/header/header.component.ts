import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of, Subscription, take } from 'rxjs';
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
  sidebarSub: Subscription | undefined = undefined;
  sidebarStatus: boolean = false;

  ngOnInit(): void {
    this.sidebarStatus$ = this.store.select(
      CommonSelectors.selectSidebarStatus
    );
  }

  ngOnDestroy(): void {
    this.sidebarSub?.unsubscribe();
  }

  toggleCategories(): void {
    this.sidebarSub = this.sidebarStatus$.pipe(take(1)).subscribe((status) => {
      this.sidebarStatus = !status;
    });
    this.store.dispatch(
      CommonActions.toggleSidebar({ sidebarStatus: this.sidebarStatus })
    );
  }
}
