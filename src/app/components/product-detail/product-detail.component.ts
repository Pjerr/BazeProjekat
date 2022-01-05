import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of, Subscription, take } from 'rxjs';
import { ProductDto } from 'src/app/models/product/productDto';
import { ProductsService } from 'src/app/services/products.service';
import { AppState } from 'src/app/store/app.state';
import * as ProductActions from '../../store/products/product.actions';
import * as ProductSelectors from '../../store/products/products.selectors';
import * as CartActions from '../../store/cart/cart.actions';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  constructor(
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private productsService: ProductsService
  ) {}

  //FIXME: get product through store and not productService
  productSub: Subscription | undefined = undefined;
  product: ProductDto | undefined = undefined;

  ngOnInit(): void {
    let pomString = this.route.snapshot.queryParamMap.get('id');
    if (pomString != null) {
      const productID: number = +pomString;
      this.productSub = this.productsService
        .getProductByID(productID)
        .pipe(take(1))
        .subscribe((product) => (this.product = product[0]));
    }
  }

  ngOnDestroy(): void {
    this.productSub?.unsubscribe();
  }

  //Would get more than a string, probably something like an object holding a comment and some user info
  getAllComments(): string[] {
    return [];
  }

  //make an api call and send the comment to database along with user info
  leaveAComment(): string {
    return 'Is good';
  }

  //TODO: probably on click show all five stars, user clickes on number of stars he wants to give
  rateProduct(): void {
    console.log('should rate this product!');
  }

  //TODO: implement cart, make an api call every time someone adds or removes something from cart?
  //QUESTION: how to make cart not remove items once you step out of the page?
  addToCart(): void {
    console.log('ADDING!');
    console.log(this.product);
    if (this.product)
      this.store.dispatch(CartActions.addToCart({ product: this.product }));
  }

  removeFromCart(): void {
    console.log('REMOVING!');
    console.log(this.product);
    if(this.product)
      this.store.dispatch(CartActions.removeFromCart({product: this.product}));
  }
}
