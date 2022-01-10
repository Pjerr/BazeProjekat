import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of, Subscription, take } from 'rxjs';
import { AppState } from 'src/app/store/app.state';
import * as CommonSelectors from '../../store/common/common.selectors';
import * as CommonActions from '../../store/common/common.actions';
import * as CartSelectors from '../../store/cart/cart.selectors';
import { ModalService } from '../_modal';
import { ProductDto } from 'src/app/models/product/productDto';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  constructor(
    private store: Store<AppState>,
    private modalService: ModalService
  ) {}

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

  openCart(modalName: string) {
    this.loadCartProducts();
    this.modalService.open(modalName);
  }

  closeCart(modalName: string): void {
    this.modalService.close(modalName);
  }

  cartProducts: Observable<ProductDto[]> = of([]);
  loadCartProducts(): void {
    console.log('loading cart!');
    this.cartProducts = this.store.select(CartSelectors.selectAllProducts);
  }
}
