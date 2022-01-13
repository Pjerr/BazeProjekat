import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { UserLoginDto } from '../models/user/userLoginDto';
import { UserLoginResponse } from '../models/user/userLoginResponse';
import { UserRegisterDto } from '../models/user/userRegisterDto';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    public jwtHelper: JwtHelperService,
    private httpClient: HttpClient
  ) {}

  decodedToken: any;

  //TODO dodaj pravu rutu fix :any ako je moguce
  login(user: UserLoginDto) {
    return this.httpClient.post(`${environment.apiURL}`, user).pipe(
      map((response: any) => {
        if (response.email != '') {
          localStorage.setItem('token', response.accessToken);
          localStorage.setItem('tip', response.tipKorisnika);
          localStorage.setItem('email', response.email);
          this.decodedToken = this.jwtHelper.decodeToken(response.accessToken);
        }
        return response;
      })
    );
  }

  loggedIn(): boolean {
    const token = localStorage.getItem('token');
    if (token) return !this.jwtHelper.isTokenExpired(token);
    else return false;
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('tip');
    localStorage.removeItem('email');
  }

  register(user: UserRegisterDto) {
    return this.httpClient.post(`${environment.apiURL}`, user).pipe(
      map((response: any) => {
        if (response.email != '') {
          localStorage.setItem('token', response.accessToken);
          localStorage.setItem('tip', 'u');
          localStorage.setItem('email', response.email);
          this.decodedToken = this.jwtHelper.decodeToken(response.accessToken);
        }
        return response;
      })
    );
  }
}
