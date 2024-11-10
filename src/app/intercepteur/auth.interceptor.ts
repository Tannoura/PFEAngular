import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthentificationService } from '../services/authentification.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService:AuthentificationService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {



    if(!request.url.includes("/loginAdmin") && !request.url.includes("/registerAdmin")&& !request.url.includes("/registerSalarie")
      && !request.url.includes("/loginSalarie")&& !request.url.includes("/initiate")&& !request.url.includes("/reset")){
      let newRequest = request.clone({
        headers : request.headers.set('Authorization','Bearer ' +this.authService.accessToken)

      })


      return next.handle(newRequest).pipe(
        catchError(err=> {
            if(err.status==401){
                 this.authService.logout();
            }
           return throwError(err.message)

        })
      );

    }


    else return next.handle(request);



  }
}
