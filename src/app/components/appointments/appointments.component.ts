import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { CreateAppointmentDialogComponent } from './create-appointment-dialog/create-appointment-dialog.component';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';

interface Appointment {
  id: number;
  num_rdv: number;
  dateTime: Date;
  reason: string;
  patientName: string;
}

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.scss']
})
export class AppointmentsComponent implements OnInit {
  displayedColumns: string[] = ['num_rdv', 'dateTime', 'patientName', 'reason', 'actions'];
  dataSource: MatTableDataSource<Appointment>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  currentFilter: 'all' | 'today' | 'tomorrow' | 'upcoming' = 'all';
  private originalData: Appointment[] = [];

  constructor(private dialog: MatDialog) {
    this.dataSource = new MatTableDataSource<Appointment>([
      // Your existing appointments array here
    ]);
  }

  ngOnInit(): void {
    this.originalData = this.getMockAppointments();
    this.dataSource.data = this.originalData;
    
    this.dataSource.filterPredicate = (data: Appointment, filter: string) => {
      const searchStr = (data.patientName + data.reason).toLowerCase();
      return searchStr.indexOf(filter.toLowerCase()) !== -1;
    };

    // Simplified sort function
    this.dataSource.sortData = (data: Appointment[], sort: MatSort) => {
      if (!sort.active || sort.direction === '') {
        // Default sort: closest dates first
        return data.sort((a, b) => 
          new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
        );
      }

      return data.sort((a, b) => {
        let propertyA: number | string = '';
        let propertyB: number | string = '';

        switch (sort.active) {
          case 'dateTime':
            // Simple chronological sort
            propertyA = new Date(a.dateTime).getTime();
            propertyB = new Date(b.dateTime).getTime();
            break;
          case 'num_rdv':
            propertyA = a.num_rdv;
            propertyB = b.num_rdv;
            break;
          case 'patientName':
            propertyA = a.patientName;
            propertyB = b.patientName;
            break;
          case 'reason':
            propertyA = a.reason;
            propertyB = b.reason;
            break;
        }

        const valueA = propertyA;
        const valueB = propertyB;

        return (valueA < valueB ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    };
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    
    // Set initial sort to show closest dates first
    if (this.sort) {
      this.sort.sort({
        id: 'dateTime',
        start: 'asc', // Changed to asc to show closest dates first
        disableClear: true
      });
    }
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(CreateAppointmentDialogComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Handle new appointment creation
        console.log('New appointment:', result);
      }
    });
  }

  editAppointment(appointment: Appointment): void {
    const dialogRef = this.dialog.open(CreateAppointmentDialogComponent, {
      width: '500px',
      data: { ...appointment, isEdit: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const index = this.dataSource.data.findIndex(a => a.id === appointment.id);
        if (index !== -1) {
          const updatedData = [...this.dataSource.data];
          updatedData[index] = { ...result, id: appointment.id };
          this.dataSource.data = updatedData;
        }
      }
    });
  }

  deleteAppointment(appointment: Appointment): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Appointment',
        message: `Are you sure you want to delete the appointment for ${appointment.patientName} on ${appointment.dateTime}?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const index = this.dataSource.data.findIndex(a => a.id === appointment.id);
        if (index !== -1) {
          const updatedData = this.dataSource.data.filter(a => a.id !== appointment.id);
          this.dataSource.data = updatedData;
        }
      }
    });
  }

  filterAppointments(filter: 'all' | 'today' | 'tomorrow' | 'upcoming'): void {
    this.currentFilter = filter;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    switch (filter) {
      case 'today':
        this.dataSource.data = this.originalData.filter(appointment => {
          const appointmentDate = new Date(appointment.dateTime);
          appointmentDate.setHours(0, 0, 0, 0);
          return appointmentDate.getTime() === today.getTime();
        });
        break;

      case 'tomorrow':
        this.dataSource.data = this.originalData.filter(appointment => {
          const appointmentDate = new Date(appointment.dateTime);
          appointmentDate.setHours(0, 0, 0, 0);
          return appointmentDate.getTime() === tomorrow.getTime();
        });
        break;

      case 'upcoming':
        this.dataSource.data = this.originalData.filter(appointment => {
          const appointmentDate = new Date(appointment.dateTime);
          return appointmentDate >= today && appointmentDate <= nextWeek;
        });
        break;

      default:
        this.dataSource.data = this.originalData;
        break;
    }

    // Reset search filter when changing predefined filters
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  private getMockAppointments(): Appointment[] {
    return [
      {
        id: 1,
        num_rdv: 1009,
        dateTime: new Date('2024-04-15T10:00:00'),  // April 15, 2024
        reason: 'Surgery Follow-up',
        patientName: 'William Anderson'
      },
      {
        id: 2,
        num_rdv: 1010,
        dateTime: new Date('2024-04-20T14:30:00'),  // April 20, 2024
        reason: 'Dermatology Consultation',
        patientName: 'Sophie Thomas'
      },
      {
        id: 3,
        num_rdv: 1001,
        dateTime: new Date('2025-05-15T09:00:00'),  // May 15, 2025
        reason: 'Regular checkup',
        patientName: 'John Doe'
      },
      {
        id: 4,
        num_rdv: 1002,
        dateTime: new Date('2024-04-10T10:30:00'),
        reason: 'Follow-up',
        patientName: 'Jane Smith'
      },
      {
        id: 5,
        num_rdv: 1003,
        dateTime: new Date('2024-04-14T14:00:00'),
        reason: 'Consultation',
        patientName: 'Robert Johnson'
      },
      {
        id: 6,
        num_rdv: 1004,
        dateTime: new Date('2024-04-18T09:00:00'),
        reason: 'Annual Physical',
        patientName: 'Maria Garcia'
      },
      {
        id: 7,
        num_rdv: 1005,
        dateTime: new Date('2024-04-22T11:30:00'),
        reason: 'Blood Test',
        patientName: 'David Wilson'
      },
      {
        id: 8,
        num_rdv: 1006,
        dateTime: new Date('2024-04-25T10:00:00'),
        reason: 'Vaccination',
        patientName: 'Sarah Brown'
      },
      {
        id: 9,
        num_rdv: 1007,
        dateTime: new Date('2024-04-28T15:30:00'),
        reason: 'Dental Checkup',
        patientName: 'Michael Taylor'
      },
      {
        id: 10,
        num_rdv: 1008,
        dateTime: new Date('2024-05-02T09:30:00'),
        reason: 'Eye Examination',
        patientName: 'Emma Martinez'
      }
    ];
  }
} 