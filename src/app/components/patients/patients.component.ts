import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { MatSort } from '@angular/material/sort';

interface ApiResponse<T> {
  status_code: number;
  status_message: string;
  data: T;
}

interface Patient {
  id_patient: number;
  nom_patient: string;
  prenom_patient: string;
  CIN: string;
  email: string;
  date_naissance: string;
  telephone: string;
  assurance: string;
  adresse: string;
  created_at: string;
  updated_at: string;
}

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.scss']
})
export class PatientsComponent implements OnInit {
  displayedColumns: string[] = ['name', 'CIN', 'date_naissance', 'telephone', 'assurance', 'actions'];
  dataSource: MatTableDataSource<Patient>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private router: Router,
    private dialog: MatDialog
  ) {
    this.dataSource = new MatTableDataSource<Patient>([]);
  }

  ngOnInit(): void {
    this.dataSource.data = this.getMockPatients();
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

  editPatient(patient: Patient): void {
    this.router.navigate(['/patients/create'], { 
      state: { patient, isEdit: true }
    });
  }

  deletePatient(patient: Patient): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Patient',
        message: `Are you sure you want to delete patient ${patient.nom_patient} ${patient.prenom_patient}?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const index = this.dataSource.data.findIndex(p => p.id_patient === patient.id_patient);
        if (index !== -1) {
          const updatedData = this.dataSource.data.filter(p => p.id_patient !== patient.id_patient);
          this.dataSource.data = updatedData;
        }
      }
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

  private getMockPatients(): Patient[] {
    return [
      {
        id_patient: 1,
        nom_patient: 'Doe',
        prenom_patient: 'John',
        CIN: 'AB123456',
        email: 'john.doe@example.com',
        date_naissance: '1980-05-15',
        telephone: '0612345678',
        assurance: 'CNSS',
        adresse: '123 Main St, Cityville',
        created_at: '2025-05-17T16:09:32.000000Z',
        updated_at: '2025-05-17T16:09:32.000000Z'
      },
      {
        id_patient: 2,
        nom_patient: 'Smith',
        prenom_patient: 'Jane',
        CIN: 'AB123457',
        email: 'jane.smith@example.com',
        date_naissance: '1992-08-23',
        telephone: '0612345679',
        assurance: 'CNSS',
        adresse: '456 Oak Ave, Townsburg',
        created_at: '2025-05-17T16:09:32.000000Z',
        updated_at: '2025-05-17T16:09:32.000000Z'
      },
      {
        id_patient: 3,
        nom_patient: 'Johnson',
        prenom_patient: 'Robert',
        CIN: 'AB123458',
        email: 'robert.johnson@example.com',
        date_naissance: '1975-03-10',
        telephone: '0612345680',
        assurance: 'CNSS',
        adresse: '789 Pine Rd, Villageton',
        created_at: '2025-05-17T16:09:32.000000Z',
        updated_at: '2025-05-17T16:09:32.000000Z'
      },
      {
        id_patient: 4,
        nom_patient: 'Garcia',
        prenom_patient: 'Maria',
        CIN: 'AB123459',
        email: 'maria.garcia@example.com',
        date_naissance: '1988-11-28',
        telephone: '0612345681',
        assurance: 'RAMED',
        adresse: '321 Elm St, Hamletville',
        created_at: '2025-05-17T16:09:32.000000Z',
        updated_at: '2025-05-17T16:09:32.000000Z'
      },
      {
        id_patient: 5,
        nom_patient: 'Wilson',
        prenom_patient: 'David',
        CIN: 'AB123460',
        email: 'david.wilson@example.com',
        date_naissance: '1965-07-04',
        telephone: '0612345682',
        assurance: 'CNSS',
        adresse: '654 Maple Dr, Boroughton',
        created_at: '2025-05-17T16:09:32.000000Z',
        updated_at: '2025-05-17T16:09:32.000000Z'
      }
    ];
  }
} 