import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthentificationService } from '../services/authentification.service';
@Injectable({
  providedIn: 'root'
  })

export class authenticationGuard implements CanActivate {


  constructor(private authService: AuthentificationService,private router:Router) {}

canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> |Promise<boolean> | boolean {
    if (this.authService.isAuthenticated==true) {
            return true;
      }else{
        this.router.navigateByUrl("/loginRegister")

        return false;
      }
        }
}
