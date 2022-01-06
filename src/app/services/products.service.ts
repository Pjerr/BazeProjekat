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

  getProductsByKategorijaTip(
    kategorija: string,
    tip: string
  ): Observable<ProductDto[]> {
    let params = new HttpParams();
    params = params.append('kategorija', kategorija);
    params = params.append('tip', tip);
    return this.httpClient.get<ProductDto[]>(
      `${environment.apiURL}product-list`,
      { params: params }
    );
  }

  getProductByKategorijaTipNaziv(kategorija: string, tip: string, naziv: string): Observable<ProductDto[]> {
    let params = new HttpParams();
    params = params.append('kategorija', kategorija);
    params = params.append('tip', tip);
    params = params.append('naziv', naziv);
    
    return this.httpClient.get<ProductDto[]>(
      `${environment.apiURL}product-list`,
      { params: params }
    );
  }
}
