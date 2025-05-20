import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Appointment, AppointmentCreateUpdate } from '../interfaces/appointment.interface';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiUrl = 'api/rendezvous'; // Replace with your actual API URL

  constructor(private http: HttpClient) {}

  getAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>('http://localhost:8000/api/rendezvous');
  }

  createAppointment(appointment: AppointmentCreateUpdate): Observable<Appointment> {
    return this.http.post<Appointment>('http://localhost:8000/api/rendezvous/create', appointment);
  }

  updateAppointment(id: number, appointment: AppointmentCreateUpdate): Observable<Appointment> {
    return this.http.put<Appointment>(`http://localhost:8000/api/rendezvous/edit/${id}`, appointment);
  }

  deleteAppointment(id: number): Observable<void> {
    return this.http.delete<void>(`http://localhost:8000/api/rendezvous/${id}`);
  }
} 