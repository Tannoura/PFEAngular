import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Membre } from '../modeles/Membre';
import { User } from '../modeles/User';

@Injectable({
  providedIn: 'root'
})
export class MembreService {

  private apiUrl = 'http://localhost:9000/api/membres'; // URL de votre API backend

  constructor(private http: HttpClient) { }

  addMembreToSession(userId: number, sessionId: number): Observable<any> {

    const params = new HttpParams()
    .set('userId', userId.toString())
    .set('sessionId', sessionId.toString());
    return this.http.post(`${this.apiUrl}/add`, {}, { params });
  }

  deleteMembre(membreId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${membreId}`);
  }

  deleteMembreByUserAndSessionId(userId: number,sessionId:Number): Observable<void> {
    const params = new HttpParams()
    .set('userId', userId.toString())
    .set('sessionId', sessionId.toString());
  return this.http.delete<void>(`${this.apiUrl}/delete`, { params });
}


getMembersBySessionId(sessionId: number): Observable<User[]> {
  return this.http.get<User[]>(`${this.apiUrl}/session/${sessionId}`);
}

isMember(userId: number, sessionId: number): Observable<boolean> {
  return this.http.get<boolean>(`${this.apiUrl}/isMember?userId=${userId}&sessionId=${sessionId}`);
}

getSessionsByUserId(userId: number): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/user/${userId}`);
}

getMembresCountByUser(): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/count`);
}

getMembreBySessionAndUser(sessionId: number, userId: number): Observable<Membre> {
  const url = `${this.apiUrl}/session/${sessionId}/user/${userId}`;
  return this.http.get<Membre>(url);
}


}



