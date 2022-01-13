import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(public auth: AuthService, public router: Router){

  }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (this.auth.loggedIn()) {
      if (route.data['role'] == localStorage.getItem("tip")) {
        return true;
      }
    }
    return false;
  }
  
}
