import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Patient } from '../interfaces/patient.interface';
@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private apiUrl = 'api/patients'; // Replace with your actual API URL

  constructor(private http: HttpClient) {}

  getPatients(): Observable<Patient[]> {
    return this.http.get<Patient[]>('http://localhost:8000/api/patient');
  }

  getPatient(id: number): Observable<Patient> {
    return this.http.get<Patient>(`${this.apiUrl}/${id}`);
  }

  createPatient(patient: Omit<Patient, 'id'>): Observable<Patient> {
    console.log("create patient", patient)
    return this.http.post<Patient>('http://localhost:8000/api/patient/create', patient);
  }

  updatePatient(id: number, patient: Patient): Observable<Patient> {
    console.log("id", id)
    console.log("patient update", patient)
    return this.http.put<Patient>(`http://localhost:8000/api/patient/edit/${id}`, patient);
  }

  deletePatient(id: number): Observable<void> {
    console.log("id", id)
    return this.http.delete<void>(`http://localhost:8000/api/patient/${id}`);
  }
} 