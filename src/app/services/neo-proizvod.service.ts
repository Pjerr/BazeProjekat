import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserKomentar } from '../models/user/userComment';

@Injectable({
  providedIn: 'root',
})
export class NeoProizvodService {
  constructor(private httpClient: HttpClient) {}

  getAllCommentsForProduct(kategorija: string, tip: string, naziv: string): Observable<UserKomentar[]> {
    let params = new HttpParams();
    params = params.append('kategorija', kategorija);
    params = params.append('tip', tip);
    params = params.append('naziv', naziv);

    return this.httpClient.get<UserKomentar[]>(`${environment.apiURL}neo_proizvod/vratiOceneIKomentare`, {
      params: params,
    });
  }
}
