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
    params = params.append("Kategorija", kategorija);
    params = params.append("Tip", tip);
    params = params.append("Proizvodjac", proizvodjac);
    params = params.append("Naziv", naziv);
    params = params.append("ascending", ascending);
    params = params.append("Pretraga", pretraga);
    return this.httpClient.get<ProductDto[]>(`${environment.apiURL}cas_proizvod`, {params: params});
  }

  deleteCassandraProizvod(kategorija: string, tip: string, naziv: string, proizvodjac: string, ocena: number, cena: number){
    let params = new HttpParams();
    params = params.append("Kategorija", kategorija);
    params = params.append("Tip", tip);
    params = params.append("Proizvodjac", proizvodjac);
    params = params.append("Naziv", naziv);
    params = params.append("Cena", cena);
    params = params.append("Ocena", ocena);
    return this.httpClient.delete(`${environment.apiURL}cas_proizvod/obrisatiIzSvihTabelaProizvoda`, {params: params})
  }

  getKategorijeITipove(){
    return this.httpClient.get(`${environment.apiURL}cas_proizvod/vratiKategorijeTipove`);
  }
  //TODO: 
  addCassandraProizvod(){

  }

  updateCassandraOcenaProizvoda(product: ProductDto){
    const body = {
      kategorija: product.kategorija,
      tip: product.tip,
      naziv: product.naziv,
      cena: product.cena,
      novaOcena: product.ocena,
      proizvodjac: product.proizvodjac,
      popust: product.popust
    }
    return this.httpClient.put(`${environment.apiURL}cas_proizvod/updateProizvodOcena`, body);
  }
}
