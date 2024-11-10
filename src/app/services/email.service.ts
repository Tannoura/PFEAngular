import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  private baseUrl = 'http://localhost:9000';

  constructor(private http: HttpClient) { }

  sendEmail(to: string, subject: string, text: string): Observable<any> {
    const params = { to, subject, text };
    return this.http.post(`${this.baseUrl}/send`, {}, { params });
  }

  sendEmailWithAttachment(email: string, subject: string, body: string, attachment: File) {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('subject', subject);
    formData.append('body', body);
    formData.append('attachment', attachment);

    return this.http.post<any>(`${this.baseUrl}/sendWithAttach`, formData);
  }
}
