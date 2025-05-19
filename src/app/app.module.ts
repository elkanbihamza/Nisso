import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

// IMPORTANT : FormsModule ajouté ici pour ngModel et ngForm
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Angular Material
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';

import { DomSanitizer } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Tes composants (exemples)
import { AppointmentsComponent } from './components/appointments/appointments.component';
import { CreateAppointmentDialogComponent } from './components/appointments/create-appointment-dialog/create-appointment-dialog.component';
import { PatientsComponent } from './components/patients/patients.component';
import { CreatePatientComponent } from './components/patients/create-patient/create-patient.component';
import { ConsultationComponent } from './components/consultation/consultation.component';
import { ConsultationHistoryDialogComponent } from './components/patients/consultation-history-dialog/consultation-history-dialog.component';

// N’oublie pas d’ajouter ici ton LoginComponent (ou d’autres composants liés à l’auth)
import { LoginComponent } from './auth/login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    AppointmentsComponent,
    CreateAppointmentDialogComponent,
    PatientsComponent,
    CreatePatientComponent,
    ConsultationComponent,
    ConsultationHistoryDialogComponent,
    LoginComponent // <= ici aussi
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,           // <--- crucial pour ngModel, ngForm
    ReactiveFormsModule,
    CommonModule,
    AppRoutingModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
    MatPaginatorModule,
    MatSortModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    this.matIconRegistry.addSvgIcon(
      'stethoscope',
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/stethoscope.svg')
    );
  }
}
