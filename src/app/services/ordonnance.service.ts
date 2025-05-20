import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrdonnanceService {
  private apiUrl = 'http://localhost:8000/api/ordonnance';

  constructor(private http: HttpClient) {}

  createOrdonnance(ordonnance: { description: string, id_patient: number }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create`, ordonnance);
  }

  updateOrdonnance(num_ordonnance: number, ordonnance: { description: string, id_patient: number }): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/edit/${num_ordonnance}`, ordonnance);
  }

  deleteOrdonnance(num_ordonnance: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${num_ordonnance}`);
  }
} 