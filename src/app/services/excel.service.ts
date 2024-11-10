import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  private apiUrl = 'http://localhost:9000/api/excel'; // URL de votre API

  constructor(private httpClient: HttpClient) { }


  exportPresence(sessionId: number): Observable<Blob> {
    const url = `${this.apiUrl}/${sessionId}/export-presences`;
    return this.httpClient.get(url, { responseType: 'blob' });
  }
}
