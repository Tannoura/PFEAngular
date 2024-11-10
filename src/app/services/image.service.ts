import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Image } from '../modeles/Image';
@Injectable({
  providedIn: 'root'
})
export class ImageService {

imageURL = 'http://localhost:9000/cloudinary/';

constructor(private httpClient: HttpClient) { }

public list(): Observable<Image[]> {
  return this.httpClient.get<Image[]>(this.imageURL + 'list');
}

public upload(image: File): Observable<any> {
  const formData = new FormData();
  formData.append('multipartFile', image);
  return this.httpClient.post<any>(this.imageURL + 'upload', formData);
}

public delete(id: any): Observable<any> {
  return this.httpClient.delete<any>(this.imageURL + `delete/${id}`);
}
}
