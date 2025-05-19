import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Consultation } from '../interfaces/consultation.interface';

@Injectable({
  providedIn: 'root'
})
export class ConsultationService {
  private apiUrl = 'api/rendezvous'; // Replace with your actual API URL

  constructor(private http: HttpClient) {}

  getConsultations(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8000/api/consultation');
  }

  createConsultation(Consultation: Omit<Consultation, 'id' | 'id_consultation'>): Observable<Consultation> {
    return this.http.post<Consultation>('http://localhost:8000/api/consultation/create', Consultation);
  }

  updateConsultation(id: number, Consultation: Consultation): Observable<Consultation> {
    console.log("id", id)
    console.log("Consultation", Consultation)
    return this.http.put<Consultation>(`http://localhost:8000/api/consulat/edit/${id}`, Consultation);
  }

  deleteConsultation(id: number): Observable<void> {
    return this.http.delete<void>(`http://localhost:8000/api/rendezvous/${id}`);
  }
} 