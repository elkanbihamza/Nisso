import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { MatSort } from '@angular/material/sort';
import { Patient } from '../../interfaces/patient.interface';
import { PatientService } from '../../services/patient.service';
import { ConsultationHistoryDialogComponent } from './consultation-history-dialog/consultation-history-dialog.component';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.scss']
})
export class PatientsComponent implements OnInit {
  originalData: Patient[] = [];
  displayedColumns: string[] = ['name', 'CIN', 'date_naissance', 'telephone', 'assurance', 'actions'];
  dataSource: MatTableDataSource<Patient>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private patientService: PatientService
  ) {
    this.dataSource = new MatTableDataSource<Patient>([]);
  }

  ngOnInit(): void {
    this.patientService.getPatients().subscribe((patients: Patient[]) => {
        console.log("patients", patients)
        this.dataSource.data = patients;
      });
    this.dataSource.filterPredicate = (data: Patient, filter: string) => {
      const searchStr = (data.nom_patient + ' ' + data.prenom_patient + ' ' + data.telephone + ' ').toLowerCase();
      return searchStr.indexOf(filter) !== -1;
    };
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  createPatient(): void {
    this.router.navigate(['/patients/create']);
  }

  getPatients(){

  }

  editPatient(patient: Patient): void {
    this.router.navigate(['/patients/create'], { 
      state: { patient, isEdit: true }
    });
  }

    deletePatient(patient: Patient): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        title: 'supprimer ce patient',
        message: `Are you sure you want to delete the patient ${patient.prenom_patient} on ${patient.nom_patient}?`
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.patientService.deletePatient(patient.id_patient).subscribe({
          next: () => {
            // Remove from dataSource after successful delete
            const updatedData = this.dataSource.data.filter(a => a.id_patient !== patient.id_patient);
            this.dataSource.data = updatedData;
          },
          error: err => {
            console.error('Delete failed:', err);
          }
        });
      }
    });
  }

  showHistory(element: any): void {
  this.dialog.open(ConsultationHistoryDialogComponent, {
    width: '500px',
    data: { consultations: element.consultations || [] }
  });
}

  startConsultation(patient: Patient): void {
    this.router.navigate(['/consultation'], { 
      state: { patient: patient }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

} 