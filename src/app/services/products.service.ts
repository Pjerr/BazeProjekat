import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ProductCatergory } from '../models/product/productCatergoryDto';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor(private httpClient: HttpClient) {}

  getAllCategories(){
    return this.httpClient.get<ProductCatergory[]>(`${environment.apiURL}product-categories`);
  }
}
