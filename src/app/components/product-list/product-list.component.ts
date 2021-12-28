import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductDto } from 'src/app/models/product/productDto';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {

  constructor(private route:ActivatedRoute) { }

  ngOnInit(): void {
    const category = this.route.snapshot.queryParamMap.get("category");
    const subcategory = this.route.snapshot.queryParamMap.get("subcategory");
    if(category != null && subcategory != null){
      this.loadProducts(category, subcategory);
    }
  }

  loadProducts(category:string, subcategory:string): void{
    console.log(`Should load items for ${category}, ${subcategory}`);
  }

}
