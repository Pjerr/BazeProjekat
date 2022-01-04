
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ProductDto } from 'src/app/models/product/productDto';
import { AppState } from 'src/app/store/app.state';
import * as ProductActions from "../../store/products/product.actions";

@Component({
  selector: 'app-product-thumb',
  templateUrl: './product-thumb.component.html',
  styleUrls: ['./product-thumb.component.scss']
})
export class ProductThumbComponent implements OnInit {

  @Input() product: ProductDto | undefined = undefined;

  constructor(private router: Router, private store: Store<AppState>) { }

  ngOnInit(): void {
  }

  showProductDetail(){
    if(this.product){
      this.store.dispatch(ProductActions.selectProduct({productID: this.product.id}));
      this.router.navigate(["product-detail"], {queryParams: {"id":this.product.id}});
    }
  }
}
