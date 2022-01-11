import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ProductDto } from '../models/product/productDto';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ProductCatergory } from '../models/product/productCatergoryDto';

@Injectable({
  providedIn: 'root'
})
export class CasProizvodService {

  constructor(private httpClient: HttpClient) { }

  getCassandraProizvodi(kategorija: string, tip: string, naziv: string, proizvodjac: string, pretraga: string, ascending: number): Observable<ProductDto[]>{
    let params = new HttpParams();
    params = params.append("kategorija", kategorija);
    params = params.append("tip", tip);
    params = params.append("proizvodjac", proizvodjac);
    params = params.append("naziv", naziv);
    params = params.append("ascending", ascending);
    params = params.append("pretraga", pretraga);
    return this.httpClient.get<ProductDto[]>(`${environment.apiURL}cas_proizvod`, {params: params});
  }

  deleteCassandraProizvod(kategorija: string, tip: string, naziv: string, proizvodjac: string, ocena: number, cena: number){
    let params = new HttpParams();
    params = params.append("kategorija", kategorija);
    params = params.append("tip", tip);
    params = params.append("proizvodjac", proizvodjac);
    params = params.append("naziv", naziv);
    params = params.append("cena", cena);
    params = params.append("ocena", ocena);
    return this.httpClient.delete(`${environment.apiURL}cas_proizvod/obrisatiIzSvihTabelaProizvoda`, {params: params})
  }

  getKategorijeITipove(){
    return this.httpClient.get(`${environment.apiURL}cas_proizvod/vratiKategorijeTipove`);
  }
  //TODO: 
  addCassandraProizvod(){

  }

  updateCassandraOcenaProizvoda(product: ProductDto, novaOcena: number){
    const body = {
      naziv: product.naziv,
      novaOcena,
      proizvodjac: product.proizvodjac
    }
    console.log(body);
    return this.httpClient.put(`${environment.apiURL}cas_proizvod/updateProizvodOcena`, {
      naziv: product.naziv,
      novaOcena,
      proizvodjac: product.proizvodjac
    });
  }
}
