import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CertificatService {
  private apiUrl = 'http://localhost:8000/api/certificat';

  constructor(private http: HttpClient) {}

  createCertificat(certificat: { contenu: string, id_patient: number }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create`, certificat);
  }

  updateCertificat(num_certif: number, certificat: { contenu: string, id_patient: number }): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/edit/${num_certif}`, certificat);
  }

  deleteCertificat(num_certif: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${num_certif}`);
  }
} 