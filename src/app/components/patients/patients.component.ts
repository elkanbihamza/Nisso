import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { MatSort } from '@angular/material/sort';

interface Patient {
  id: number;
  first_name: string;
  last_name: string;
  birth_date: Date;
  gender: string;
  address: string;
  phone_number: string;
}

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.scss']
})
export class PatientsComponent implements OnInit {
  displayedColumns: string[] = ['name', 'birth_date', 'gender', 'address', 'phone_number', 'actions'];
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
      const searchStr = (data.first_name + ' ' + data.last_name + ' ' + data.phone_number).toLowerCase();
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
        message: `Are you sure you want to delete patient ${patient.first_name} ${patient.last_name}?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const index = this.dataSource.data.findIndex(p => p.id === patient.id);
        if (index !== -1) {
          const updatedData = this.dataSource.data.filter(p => p.id !== patient.id);
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
        id: 1,
        first_name: 'John',
        last_name: 'Doe',
        birth_date: new Date('1980-05-15'),
        gender: 'Male',
        address: '123 Main St, Cityville, ST 12345',
        phone_number: '555-0123'
      },
      {
        id: 2,
        first_name: 'Jane',
        last_name: 'Smith',
        birth_date: new Date('1992-08-23'),
        gender: 'Female',
        address: '456 Oak Ave, Townsburg, ST 12346',
        phone_number: '555-0124'
      },
      {
        id: 3,
        first_name: 'Robert',
        last_name: 'Johnson',
        birth_date: new Date('1975-03-10'),
        gender: 'Male',
        address: '789 Pine Rd, Villageton, ST 12347',
        phone_number: '555-0125'
      },
      {
        id: 4,
        first_name: 'Maria',
        last_name: 'Garcia',
        birth_date: new Date('1988-11-28'),
        gender: 'Female',
        address: '321 Elm St, Hamletville, ST 12348',
        phone_number: '555-0126'
      },
      {
        id: 5,
        first_name: 'David',
        last_name: 'Wilson',
        birth_date: new Date('1965-07-04'),
        gender: 'Male',
        address: '654 Maple Dr, Boroughton, ST 12349',
        phone_number: '555-0127'
      },
      {
        id: 6,
        first_name: 'Sarah',
        last_name: 'Brown',
        birth_date: new Date('1995-01-17'),
        gender: 'Female',
        address: '987 Cedar Ln, Districtville, ST 12350',
        phone_number: '555-0128'
      },
      {
        id: 7,
        first_name: 'Michael',
        last_name: 'Taylor',
        birth_date: new Date('1970-09-30'),
        gender: 'Male',
        address: '147 Birch Blvd, Metropolis, ST 12351',
        phone_number: '555-0129'
      },
      {
        id: 8,
        first_name: 'Emma',
        last_name: 'Martinez',
        birth_date: new Date('1983-12-05'),
        gender: 'Female',
        address: '258 Willow Way, Suburbville, ST 12352',
        phone_number: '555-0130'
      },
      {
        id: 9,
        first_name: 'William',
        last_name: 'Anderson',
        birth_date: new Date('1990-04-22'),
        gender: 'Male',
        address: '369 Spruce St, Ruraltown, ST 12353',
        phone_number: '555-0131'
      },
      {
        id: 10,
        first_name: 'Sophie',
        last_name: 'Thomas',
        birth_date: new Date('1987-06-14'),
        gender: 'Female',
        address: '741 Ash Ave, Countryside, ST 12354',
        phone_number: '555-0132'
      },
      {
        id: 11,
        first_name: 'James',
        last_name: 'Moore',
        birth_date: new Date('1978-02-28'),
        gender: 'Male',
        address: '852 Poplar Pl, Outskirts, ST 12355',
        phone_number: '555-0133'
      },
      {
        id: 12,
        first_name: 'Isabella',
        last_name: 'White',
        birth_date: new Date('1993-10-09'),
        gender: 'Female',
        address: '963 Sycamore St, Downtown, ST 12356',
        phone_number: '555-0134'
      },
      {
        id: 13,
        first_name: 'Lucas',
        last_name: 'Clark',
        birth_date: new Date('1982-08-11'),
        gender: 'Male',
        address: '159 Redwood Rd, Uptown, ST 12357',
        phone_number: '555-0135'
      },
      {
        id: 14,
        first_name: 'Olivia',
        last_name: 'Lee',
        birth_date: new Date('1991-03-25'),
        gender: 'Female',
        address: '753 Magnolia Dr, Midtown, ST 12358',
        phone_number: '555-0136'
      },
      {
        id: 15,
        first_name: 'Ethan',
        last_name: 'Rodriguez',
        birth_date: new Date('1985-12-19'),
        gender: 'Male',
        address: '951 Dogwood Dr, Eastside, ST 12359',
        phone_number: '555-0137'
      }
    ];
  }
} 