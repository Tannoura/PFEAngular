import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { PlanningEntry } from '../modeles/PlanningEntry';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlanningEntryService {

  constructor(private http:HttpClient,private router : Router) { }

  private baseUrl ="http://localhost:9000/api/planningEntry"

  createPlanningEntry(sessionId: number, planningEntry: PlanningEntry): Observable<PlanningEntry> {
    const url = `${this.baseUrl}/${sessionId}`;
    return this.http.post<PlanningEntry>(url, planningEntry);
  }

  getPlanningEntriesBySessionId(sessionId:number): Observable<PlanningEntry[]> {
    return this.http.get<PlanningEntry[]>(`${this.baseUrl}/session/${sessionId}`);
 }
}
