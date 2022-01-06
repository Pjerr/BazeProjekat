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
  proizvodjaciToFilterBy: string[] = [];
  selectedFilterOption: string = "None";
  filters: string[] = ["None" ,"Popularity", "Price des", "Price asc", "Rating"]

  ngOnInit(): void {
    const kategorija = this.route.snapshot.queryParamMap.get('kategorija');
    const tip = this.route.snapshot.queryParamMap.get('tip');
    if (kategorija != null && tip != null) {
      this.loadProducts(kategorija, tip);
    }
  }

  loadProducts(kategorija: string, tip: string): void {
    this.store.dispatch(ProductActions.loadProducts({ kategorija, tip }));
    this.products = this.store.select(ProductSelectors.selectAllProducts);
  }

  filterByProizvodjaci(checked: boolean, manufacturer: string) {
    if (checked) {
      this.proizvodjaciToFilterBy.push(manufacturer);
      console.log('Checked!');
      console.log(this.proizvodjaciToFilterBy);
    } else {
      this.proizvodjaciToFilterBy.splice(
        this.proizvodjaciToFilterBy.indexOf(manufacturer),
        1
      );
      console.log('Unchecked!');
      console.log(this.proizvodjaciToFilterBy);
    }
  }
  filterBySelectedOption(){
    console.log("Should filter by this!");
    console.log(this.selectedFilterOption);
  }
}
