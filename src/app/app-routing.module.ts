import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppointmentsComponent } from './components/appointments/appointments.component';
import { PatientsComponent } from './components/patients/patients.component';
import { CreatePatientComponent } from './components/patients/create-patient/create-patient.component';
import { ConsultationComponent } from './components/consultation/consultation.component';

const routes: Routes = [
  { path: '', redirectTo: '/appointments', pathMatch: 'full' },
  { path: 'appointments', component: AppointmentsComponent },
  { path: 'patients', component: PatientsComponent },
  { path: 'patients/create', component: CreatePatientComponent },
  { path: 'consultation', component: ConsultationComponent },
  { path: 'visits', component: ConsultationComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { } 