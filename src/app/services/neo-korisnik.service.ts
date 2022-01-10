import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NeoKorisnikService {
  constructor(private httpClient: HttpClient) {}

  leaveComment(username: string, komentar: string, naziv: string) {
    const body = {
      username,
      komentar,
      naziv,
    };
    console.log(body);
    return this.httpClient.post(
      `${environment.apiURL}neo_korisnik/komentarisiProizvod`,
      body,
      { responseType: 'text' }
    );
  }

  rateProduct(username: string, ocena: number, naziv: string) {
    const body = {
      username,
      ocena,
      naziv,
    };
    console.log(body);
    return this.httpClient.post(
      `${environment.apiURL}neo_korisnik/oceniProizvod`,
      body,
      { responseType: 'text' }
    );
  }
}
