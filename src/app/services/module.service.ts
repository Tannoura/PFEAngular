import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Module } from '../modeles/Module';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthentificationService } from './authentification.service';

@Injectable({
  providedIn: 'root'
})
export class ModuleService {

  private moduleIdSource = new BehaviorSubject<number | null>(null);
  currentModuleId = this.moduleIdSource.asObservable();

  constructor(private http:HttpClient,private router : Router,private authService:AuthentificationService) { }
  private baseUrl ="http://localhost:9000/api/modules"

  getModulesBySalarié(salarieId:number): Observable<Module[]> {
    this.authService.loadProfile();
    salarieId = this.authService.userId;
    return this.http.get<Module[]>(`${this.baseUrl}/bySalarie/${salarieId}`);
  }

  getModules(): Observable<Module[]> {
    return this.http.get<Module[]>(`${this.baseUrl}`);
  }

  addModule( module: Module): Observable<Module> {
    return this.http.post<Module>(`${this.baseUrl}`, module);
  }


  getModulesByOrganisme(organismeId: number) {
    const url = `${this.baseUrl}/organisme/${organismeId}`;
    return this.http.get<Module[]>(url);  }


    deleteModule(moduleId: number): Observable<void> {
      return this.http.delete<void>(`${this.baseUrl}/${moduleId}`);
    }

    changeModuleId(moduleId: number): void {
      this.moduleIdSource.next(moduleId);
    }

    getNombreModulesSansOrganismes(): Observable<number> {
      return this.http.get<number>(`${this.baseUrl}/sans-organismes`);
    }

    getMatiereById(id: number): Observable<string> {
      return this.http.get(`${this.baseUrl}/${id}/matiere`, { responseType: 'text' });
    }
}
