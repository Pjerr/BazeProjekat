import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ProductDto } from '../models/product/productDto';

@Injectable({
  providedIn: 'root'
})
export class CasPopularnoService {

  constructor(private httpClient: HttpClient) { }

  getCassandraPopularni(){
    return this.httpClient.get(`${environment.apiURL}cas_popularno`);
  }

  addCassandraPopularni(proizvodi: ProductDto[]){
    return this.httpClient.post(`${environment.apiURL}cas_popularno/dodajNovePopularne`, proizvodi);
  }

  deleteCassandraPopularni(){
    return this.httpClient.delete(`${environment.apiURL}cas_popularno/obrisiOceneIPopularno`);
  }
}
