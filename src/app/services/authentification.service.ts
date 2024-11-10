import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Admin } from '../modeles/Admin';
import { catchError, Observable } from 'rxjs';
import { AuthenticationResponse } from '../modeles/AuthenticationResponse';
import { Salarie } from '../modeles/Salarie';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {

  constructor(private http:HttpClient,private router : Router) { }

  private baseUrl ="http://localhost:9000"



  isAuthenticated : boolean=false;
  username:any;
  accessToken!:any;
  UserRole! : any ;
  userId!:any;
  lastname:any;
  firstname:any;

  isAdmin(): boolean {
    // Vérifiez si l'utilisateur est authentifié et s'il a le rôle ADMIN
    return this.isAuthenticated=true && this.UserRole === 'ADMIN';
  }

  isSalarie():boolean{
    return this.isAuthenticated=true && this.UserRole === 'SALARIE';
  }


  registerAdmin(admin: Admin): Observable<AuthenticationResponse> {

    return this.http.post<AuthenticationResponse>(`${this.baseUrl}/registerAdmin`, admin);
  }

  registerSalarie(salarie: Salarie): Observable<AuthenticationResponse> {

    return this.http.post<AuthenticationResponse>(`${this.baseUrl}/registerSalarie`, salarie);

  }


loginAdmin(admin: Admin): Observable<AuthenticationResponse> {
  let options = {
    headers: new HttpHeaders().set("Content-Type", "application/json")
  }

  return this.http.post<AuthenticationResponse>(`${this.baseUrl}/loginAdmin`, admin, options);
}

loginSalarie(salarie: Salarie): Observable<AuthenticationResponse> {
  let options = {
    headers: new HttpHeaders().set("Content-Type", "application/json")
  }

  return this.http.post<AuthenticationResponse>(`${this.baseUrl}/loginSalarie`, salarie, options);
}


  loadProfile(){
    this.isAuthenticated=true;
    console.log(this.isAuthenticated);
    this.accessToken = localStorage.getItem('token');
  let decodedJwt:any =  jwtDecode(this.accessToken);
  this.username=decodedJwt.sub;
  this.UserRole=decodedJwt.role;
  this.userId=decodedJwt.id;
  this.lastname=decodedJwt.lastname;
  this.firstname=decodedJwt.firstname;

  }

     logout() {
this.isAuthenticated=false;
this.accessToken=undefined;
this.username=undefined;
this.UserRole=undefined;
this.userId=undefined;
this.lastname=undefined;
this.firstname=undefined;
window.localStorage.removeItem("token")
window.localStorage.removeItem("id")
  }

  updateUser(userId: number, updatedUser: Salarie): Observable<Salarie> {
    const url = `${this.baseUrl}/${userId}`;
    return this.http.put<Salarie>(url, updatedUser);
  }
  initiatePasswordReset(email: string): Observable<any> {
    const url = `${this.baseUrl}/initiate`;
    let params = new HttpParams().set('email', email);
    return this.http.post<any>(url, {}, { params });
  }

  resetPassword(token: string, newPassword: string): Observable<string> {
    const url = `${this.baseUrl}/reset?token=${(token)}&newPassword=${(newPassword)}`;
    return this.http.post<string>(url, {});
  }

  getSalariéCount(): Observable<number> {
    return this.http.get<number>(this.baseUrl+"/countSalariés");
  }

  getAllSalariés(): Observable<Salarie[]> {
    return this.http.get<Salarie[]>(this.baseUrl+"/allSalarie");
  }
}
