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
  rated: boolean = false; //moramo da preuzmemo nekako od korisnika + da ogranicimo da mogu da ratuju samo oni koji su logovani
  clickedOnRate: boolean = false;

  ngOnInit(): void {
    const kategorija = this.route.snapshot.queryParamMap.get("kategorija");
    const tip = this.route.snapshot.queryParamMap.get("tip");
    const naziv = this.route.snapshot.queryParamMap.get("naziv");
    if (kategorija != null && tip != null && naziv != null) {
      this.productSub = this.productsService
        .getProductByKategorijaTipNaziv(kategorija, tip, naziv)
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

  //TODO: SHOW ALL FIVE STARS
  openRating(): void{
    if(!this.rated){
      this.clickedOnRate = true;
    }
  }
  //TODO: probably on click show all five stars, user clickes on number of stars he wants to give
  rateProduct(rating: number): void {
    console.log(`should rate this product with ${rating}`);
    this.rated = true
    this.clickedOnRate = false;
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
