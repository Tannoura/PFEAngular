import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Presence } from '../modeles/Presence';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {

  private apiUrl = "http://localhost:9000/api/presence";

  constructor(private http: HttpClient) { }

  // Récupérer les présences pour une session donnée
  getPresencesBySession(sessionId: number): Observable<Presence[]> {
    return this.http.get<Presence[]>(`${this.apiUrl}/session/${sessionId}/presences`);
  }

  // Marquer la présence d'un membre
  markPresence(membreId: number, present: boolean,date:string): Observable<void> {
    const params = new HttpParams().set('present', present.toString())
    .set('date', date);
    return this.http.post<void>(`${this.apiUrl}/membre/${membreId}/presence`, null, { params });
  }

  checkPresenceExists(membreId: number,jour:string): Observable<boolean> {
    const params = new HttpParams()
    .set('membreId', membreId.toString())
    .set('jour', jour);
    return this.http.get<boolean>(`${this.apiUrl}/exists`,{params});
  }

  updatePresence(membreId: number, present: boolean,date:string): Observable<void> {
    let params = new HttpParams()
      .set('membreId', membreId.toString())
      .set('present', present.toString())
      .set('date', date);
    return this.http.put<void>(`${this.apiUrl}/update`, null, { params });
  }

  getPresencesBySessionIdAndUserId(sessionId: number, userId: number): Observable<Presence[]> {
    const params = new HttpParams()
      .set('sessionId', sessionId.toString())
      .set('userId', userId.toString());

    return this.http.get<Presence[]>(this.apiUrl, { params });
  }

  // Obtient le taux de présence pour une session spécifique d'un utilisateur donné
  getTauxDePresenceParSessionAndUser(userId: number, sessionId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/user/${userId}/session/${sessionId}/taux`);
  }
}
