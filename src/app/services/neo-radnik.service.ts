import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Radnik } from '../models/user/radnik';

@Injectable({
  providedIn: 'root',
})
export class NeoRadnikService {
  constructor(private httpClient: HttpClient) {}

  getAllRadnici(): Observable<Radnik[]> {
    return this.httpClient.get<Radnik[]>(
      `${environment.apiURL}neo_radnik/preuzmiRadnike`
    );
  }

  getSpecificRadnik(username: string): Observable<Radnik> {
    let params = new HttpParams();
    params = params.append('username', username);
    return this.httpClient.get<Radnik>(
      `${environment.apiURL}neo_radnik/preuzmiRadnika`,
      {
        params: params,
      }
    );
  }

  addRadnik(radnik: Radnik) {
    const body = {
      username: radnik.username,
      password: radnik.password,
      ime: radnik.ime,
      prezime: radnik.prezime,
    };

    return this.httpClient.post(
      `${environment.apiURL}neo_radnik/dodajRadnika`,
      body
    );
  }

  deleteRadnik(username: string) {
    let params = new HttpParams();
    params = params.append('username', username);
    return this.httpClient.delete(
      `${environment.apiURL}neo_radnik/obrisiRadnika`,
      {
        params: params,
      }
    );
  }

  fireRadnik(username: string, grad:string, adresa: string){
    let params = new HttpParams();
    params = params.append("username", username);
    params = params.append("grad", grad);
    params = params.append("adresa", adresa);

    return this.httpClient.delete(
      `${environment.apiURL}neo_radnik/otpustiRadnika`,
      {
        params: params,
      }
    );

  }

  getZaposlenje(username: string, grad: string, adresa: string) {
    let params = new HttpParams();
    params = params.append('username', username);
    params = params.append('grad', grad);
    params = params.append('adresa', adresa);
    return this.httpClient.get(
      `${environment.apiURL}neo_radnik/preuzmiZaposlenje`,
      {
        params: params,
      }
    );
  }

  getInfoOProdavniciUKojojRadiRadnik(username: string) {
    let params = new HttpParams();
    params = params.append('username', username);

    return this.httpClient.get(
      `${environment.apiURL}neo_radnik/preuzmiInfoOProdavnici`,
      {
        params: params,
      }
    );
  }

  zaposliRadnika(
    username: string,
    grad: string,
    adresa: string,
    pozicija: string,
    datum: string
  ) {
    const body = {
      username,
      grad,
      adresa,
      pozicija,
      datum,
    };

    return this.httpClient.post(
      `${environment.apiURL}neo_radnik/zaposliRadnika`,
      body
    );
  }

  updatePozicijaRadnika(
    username: string,
    grad: string,
    adresa: string,
    pozicija: string,
  ) {
    const body = {
      username,
      grad,
      adresa,
      pozicija,
    };

    return this.httpClient.put(
      `${environment.apiURL}neo_radnik/izmeniPoziciju`,
      body
    );
  }
}
