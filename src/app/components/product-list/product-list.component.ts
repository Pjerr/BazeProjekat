import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { ProductDto } from 'src/app/models/product/productDto';
import { AppState } from 'src/app/store/app.state';
import * as ProductActions from '../../store/products/product.actions';
import * as ProductSelectors from '../../store/products/products.selectors';
@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  constructor(private route: ActivatedRoute, private store: Store<AppState>) {}

  products: Observable<ProductDto[]> = of([]);
  manufacturersToFilterBy: string[] = [];
  selectedFilterOption: string = "None";
  filters: string[] = ["None" ,"Popularity", "Price des", "Price asc", "Rating"]

  ngOnInit(): void {
    const category = this.route.snapshot.queryParamMap.get('category');
    const subcategory = this.route.snapshot.queryParamMap.get('subcategory');
    if (category != null && subcategory != null) {
      this.loadProducts(category, subcategory);
    }
  }

  loadProducts(category: string, subcategory: string): void {
    this.store.dispatch(ProductActions.loadProducts({ category, subcategory }));
    this.products = this.store.select(ProductSelectors.selectAllProducts);
  }

  filterByManufacturers(checked: boolean, manufacturer: string) {
    if (checked) {
      this.manufacturersToFilterBy.push(manufacturer);
      console.log('Checked!');
      console.log(this.manufacturersToFilterBy);
    } else {
      this.manufacturersToFilterBy.splice(
        this.manufacturersToFilterBy.indexOf(manufacturer),
        1
      );
      console.log('Unchecked!');
      console.log(this.manufacturersToFilterBy);
    }
  }
  filterBySelectedOption(){
    console.log("Should filter by this!");
    console.log(this.selectedFilterOption);
  }
}
