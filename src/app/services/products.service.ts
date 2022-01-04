import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ProductCatergory } from '../models/product/productCatergoryDto';
import { ProductDto } from '../models/product/productDto';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor(private httpClient: HttpClient) {}

  getAllCategories(): Observable<ProductCatergory[]> {
    return this.httpClient.get<ProductCatergory[]>(
      `${environment.apiURL}product-categories`
    );
  }

  getProductsByCategoryAndSubcategory(
    category: string,
    subcategory: string
  ): Observable<ProductDto[]> {
    let params = new HttpParams();
    params = params.append('category', category);
    params = params.append('subcategory', subcategory);
    return this.httpClient.get<ProductDto[]>(
      `${environment.apiURL}product-list-1`,
      { params: params }
    );
  }

  getProductByID(productID: number): Observable<ProductDto[]> {
    let params = new HttpParams();
    params = params.append('id', productID);
    return this.httpClient.get<ProductDto[]>(
      `${environment.apiURL}product-list-1`,
      { params: params }
    );
  }
}
