import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { ProductCatergory } from 'src/app/models/product/productCatergoryDto';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  constructor(private productsService: ProductsService, private router: Router) {}

  ngOnInit(): void {
    this.getAllCategories();
    this.initSubcategoryShown();
  }

  productCategories: Observable<ProductCatergory[]> = of([]);
  isSubcategoryShown: boolean[] = [];
  getAllCategories(): void {
    this.productCategories = this.productsService.getAllCategories();
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
    this.router.navigate(["products"], {queryParams: {category, subcategory}})
  }
}
