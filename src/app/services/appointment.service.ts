import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Appointment } from '../interfaces/appointment.interface';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiUrl = 'api/rendezvous'; // Replace with your actual API URL

  constructor(private http: HttpClient) {}

  getAppointments(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8000/api/rendezvous');
  }

  createAppointment(appointment: Omit<Appointment, 'id' | 'num_rdv'>): Observable<Appointment> {
    return this.http.post<Appointment>(this.apiUrl, appointment);
  }

  updateAppointment(id: number, appointment: Appointment): Observable<Appointment> {
    console.log("id", id)
    console.log("appointment", appointment)
    return this.http.put<Appointment>(`http://localhost:8000/api/rendezvous/edit/${id}`, appointment);
  }

  deleteAppointment(id: number): Observable<void> {
    return this.http.delete<void>(`http://localhost:8000/api/rendezvous/${id}`);
  }
} 