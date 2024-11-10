import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Session } from '../modeles/Session';
import { Observable } from 'rxjs';
import { StatutSession } from '../modeles/StatutSession';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor(private http:HttpClient,private router : Router) { }

  private baseUrl ="http://localhost:9000/api/sessions"


  getSessions(): Observable<Session[]> {
    return this.http.get<Session[]>(`${this.baseUrl}`);
  }

  addSession( session: Session): Observable<Session> {
    return this.http.post<Session>(`${this.baseUrl}`, session);
  }

  getTotalCost(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/total-cost`);
  }

  updateSessionStatus(sessionId: number, status: StatutSession): Observable<any> {
    const url = `${this.baseUrl}/updateSessionstatus/${sessionId}/${status}`;
    return this.http.put(url, {}, { responseType: 'text' });
  }

  getSessionsByModule(moduleId: number): Observable<Session[]> {
    return this.http.get<Session[]>(`${this.baseUrl}/module/${moduleId}`);
  }

  getPlanningDates(sessionId: number): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/${sessionId}/planning-dates`);
  }

  getNumberOfSessionsValidatedByAdmin(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/sessions-valides`);
  }

  getNumberOfSessionsNotValidatedByAdmin(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/sessions-non-valides`);
  }

  getMaxSessionCost(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/cout-maximal`);
  }

  getTotalPlanningHours(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/total-planning-hours`);
  }

  getClosestSession(date: string): Observable<Session> {
    return this.http.get<Session>(`${this.baseUrl}/closest`, {
      params: { date }
    });
  }

  getClosestSessionBySalarie(employeeId: number, currentDate: string): Observable<Session> {
    return this.http.get<Session>(`${this.baseUrl}/closest/${employeeId}`, {
      params: {
        currentDate: currentDate
      }
    });
  }
}
