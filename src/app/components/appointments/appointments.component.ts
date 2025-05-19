import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { CreateAppointmentDialogComponent } from './create-appointment-dialog/create-appointment-dialog.component';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { AppointmentService } from '../../services/appointment.service';
import { Appointment } from '../../interfaces/appointment.interface';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.scss']
})
export class AppointmentsComponent implements OnInit {
  displayedColumns: string[] = ['num_rdv', 'date_rdv', 'patientName', 'motif', 'actions'];
  dataSource: MatTableDataSource<Appointment>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  currentFilter: 'all' | 'today' | 'tomorrow' | 'upcoming' = 'all';
  private originalData: Appointment[] = [];

  constructor(private dialog: MatDialog, private appointmentService: AppointmentService) {
    this.dataSource = new MatTableDataSource<Appointment>([
      // Your existing appointments array here
    ]);
  }

  ngOnInit(): void {
    this.appointmentService.getAppointments().subscribe((appointments: Appointment[]) => {
      console.log("appointments", appointments)
    this.originalData = appointments;
    this.dataSource.data = appointments;
  });
    
    this.dataSource.filterPredicate = (data: Appointment, filter: string) => {
      const searchStr = (data.patient.prenom_patient + data.motif).toLowerCase();
      return searchStr.indexOf(filter.toLowerCase()) !== -1;
    };

    // Simplified sort function
    this.dataSource.sortData = (data: Appointment[], sort: MatSort) => {
      if (!sort.active || sort.direction === '') {
        // Default sort: closest dates first
        return data.sort((a, b) => 
          new Date(a.date_rdv).getTime() - new Date(b.date_rdv).getTime()
        );
      }

      return data.sort((a, b) => {
        let propertyA: number | string = '';
        let propertyB: number | string = '';

        switch (sort.active) {
          case 'date_rdv':
            // Simple chronological sort
            propertyA = new Date(a.date_rdv).getTime();
            propertyB = new Date(b.date_rdv).getTime();
            break;
          case 'num_rdv':
            propertyA = a.num_rdv;
            propertyB = b.num_rdv;
            break;
          case 'patientName':
            propertyA = a.patient.prenom_patient;
            propertyB = b.patient.prenom_patient;
            break;
          case 'motif':
            propertyA = a.motif;
            propertyB = b.motif;
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
        id: 'date_rdv',
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
      console.log("result", result)
      this.appointmentService.updateAppointment(appointment.num_rdv, result).subscribe({
        next: (updatedAppointment: Appointment) => {
          const index = this.dataSource.data.findIndex(a => a.num_rdv === appointment.num_rdv);
          if (index !== -1) {
            const updatedData = [...this.dataSource.data];
            updatedData[index] = updatedAppointment;
            this.dataSource.data = updatedData;
          }
        },
        error: err => {
          console.error('Update failed:', err);
        }
      });
    }
  });
}



  deleteAppointment(appointment: Appointment): void {
  const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
    width: '400px',
    data: {
      title: 'supprimer ce rendez-vous',
      message: `Are you sure you want to delete the appointment for ${appointment.patient.prenom_patient} on ${appointment.date_rdv}?`
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.appointmentService.deleteAppointment(appointment.num_rdv).subscribe({
        next: () => {
          // Remove from dataSource after successful delete
          const updatedData = this.dataSource.data.filter(a => a.num_rdv !== appointment.num_rdv);
          this.dataSource.data = updatedData;
        },
        error: err => {
          console.error('Delete failed:', err);
        }
      });
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
          const appointmentDate = new Date(appointment.date_rdv);
          appointmentDate.setHours(0, 0, 0, 0);
          return appointmentDate.getTime() === today.getTime();
        });
        break;

      case 'tomorrow':
        this.dataSource.data = this.originalData.filter(appointment => {
          const appointmentDate = new Date(appointment.date_rdv);
          appointmentDate.setHours(0, 0, 0, 0);
          return appointmentDate.getTime() === tomorrow.getTime();
        });
        break;

      case 'upcoming':
        this.dataSource.data = this.originalData.filter(appointment => {
          const appointmentDate = new Date(appointment.date_rdv);
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

} 