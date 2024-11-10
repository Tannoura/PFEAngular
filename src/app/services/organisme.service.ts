import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Organisme } from '../modeles/Organisme';
import { Observable, catchError } from 'rxjs';
import { Module } from '../modeles/Module';

@Injectable({
  providedIn: 'root'
})
export class OrganismeService {

  constructor(private http:HttpClient,private router :Router) { }

  private baseUrl ="http://localhost:9000/api/organismes"
  private baseUrl1 ="http://localhost:9000/api/modules"

  addOrganisme( photo: File,nomOrganisme:string,adresseOrganisme:string,numeroOrganisme:number,moduleId:number): Observable<any> {
    // Créez un objet FormData pour inclure le nom et la photo
    const formData = new FormData();
    formData.append('nomOrganisme', nomOrganisme);
    formData.append('adresseOrganisme', adresseOrganisme);
    formData.append('photo', photo);
    formData.append('numeroOrganisme', numeroOrganisme.toString());
    formData.append('moduleId', moduleId.toString());
    return this.http.post<any>(`${this.baseUrl}`, formData);
  }

  getOrganismes(): Observable<Organisme[]> {
    return this.http.get<Organisme[]>(`${this.baseUrl}`);
  }

  addModuleToOrganisme(organismeId: number, moduleId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/${organismeId}/modules/${moduleId}`, {});
  }

  getOrganismesByModule(idModule: number) {
    const url = `${this.baseUrl1}/${idModule}/organismes`;
    return this.http.get<Organisme[]>(url);  }


    getOrganismesByModuleWithoutId(module: Module): Observable<Organisme[]> {
      return this.http.get<Organisme[]>(`${this.baseUrl}/module`, { params: { module: JSON.stringify(module) } });
    }

      AddOrganismeSansModule( photo: File,nomOrganisme:string,adresseOrganisme:string,numeroOrganisme:number): Observable<any> {
        const formData = new FormData();
        formData.append('nomOrganisme', nomOrganisme);
        formData.append('adresseOrganisme', adresseOrganisme);
        formData.append('photo', photo);
        formData.append('numeroOrganisme', numeroOrganisme.toString());
        return this.http.post<any>(`${this.baseUrl}/OsM`, formData);
      }

      deleteOrganisme(organismeId: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${organismeId}`);
      }
    }
