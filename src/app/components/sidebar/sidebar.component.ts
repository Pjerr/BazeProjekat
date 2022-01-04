import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { ProductCatergory } from 'src/app/models/product/productCatergoryDto';
import { AppState } from 'src/app/store/app.state';
import * as ProductCategoryActions from '../../store/productCategories/productCategories.actions';
import * as ProductCategorySelectors from '../../store/productCategories/productCategories.selectors';
import * as CommonActions from '../../store/common/common.actions';
import * as ProductActions from '../../store/products/product.actions';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  constructor(private store: Store<AppState>, private router: Router) {}

  ngOnInit(): void {
    this.getAllCategories();
    this.initSubcategoryShown();
  }

  productCategories: Observable<ProductCatergory[]> = of([]);
  isSubcategoryShown: boolean[] = [];
  getAllCategories(): void {
    this.store.dispatch(ProductCategoryActions.loadCategoriesAndSubcategories());
    this.productCategories = this.store.select(ProductCategorySelectors.selectAllCategories);
  }

  initSubcategoryShown(): void{
    this.productCategories.forEach(()=>{
      this.isSubcategoryShown.push(false);
    });
  }

  toggleSubcategories(index:number){
    this.isSubcategoryShown[index] = !this.isSubcategoryShown[index]
  }

  hideSubcategories(index:number){
    this.isSubcategoryShown[index] = false;
  }

  moveToProductList(category:string, subcategory: string){
    this.store.dispatch(ProductCategoryActions.selectCategoryAndSubcategory({category, subcategory}));
    this.store.dispatch(CommonActions.toggleSidebar({sidebarStatus: false}));
    this.store.dispatch(ProductActions.loadProducts({ category, subcategory }));
    this.router.navigate(["products"], {queryParams: {category, subcategory}})
  }
}
