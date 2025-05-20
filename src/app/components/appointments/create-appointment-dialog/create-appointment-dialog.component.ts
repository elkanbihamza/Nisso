import { Component, Inject, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PatientService } from '../../../services/patient.service';
import { Patient } from '../../../interfaces/patient.interface';
import { AppointmentService } from '../../../services/appointment.service';
import { Appointment, AppointmentCreateUpdate, AppointmentDialogData } from '../../../interfaces/appointment.interface';

@Component({
  selector: 'app-create-appointment-dialog',
  templateUrl: './create-appointment-dialog.component.html',
  styleUrls: ['./create-appointment-dialog.component.scss']
})
export class CreateAppointmentDialogComponent {
  @Output() appointmentCreated = new EventEmitter<Appointment>();
  appointmentForm: FormGroup;
  isEdit: boolean;
  patients: Patient[] = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CreateAppointmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AppointmentDialogData,
    private patientService: PatientService,
    private appointmentService: AppointmentService
  ) {
    this.isEdit = data?.isEdit || false;
    
    this.appointmentForm = this.fb.group({
      id_patient: ['', Validators.required],
      date_rdv: ['', Validators.required],
      time_rdv: ['', Validators.required],
      motif: ['', Validators.required]
    });

    if (this.isEdit && data) {
      // Format the date and time from the appointment data
      const appointmentDate = new Date(data.date_rdv);
      const timeString = appointmentDate.toTimeString().slice(0, 5); // Get HH:mm format
      
      this.appointmentForm.patchValue({
        id_patient: data.id_patient,
        date_rdv: appointmentDate,
        time_rdv: timeString,
        motif: data.motif
      });
    }
  }

  ngOnInit(): void {
    // Always load patients for both create and edit modes
    this.patientService.getPatients().subscribe(
      patients => this.patients = patients
    );
  }

  formatDateTime(date: Date, time: string): string {
    const pad = (n: number) => n < 10 ? '0' + n : n;
    const [hours, minutes] = time.split(':');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${hours}:${minutes}:00`;
  }

  onSubmit(): void {
    if (this.appointmentForm.valid) {
      const { id_patient, motif, date_rdv, time_rdv } = this.appointmentForm.value;
      
      // Ensure we have valid date and time
      if (!date_rdv || !time_rdv) {
        console.error('Date or time is missing');
        return;
      }

      // Convert date_rdv to Date if it's not already
      const dateObj = new Date(date_rdv);
      const formattedDate = this.formatDateTime(dateObj, time_rdv);

      const appointmentData: AppointmentCreateUpdate = { 
        id_patient, 
        motif, 
        date_rdv: formattedDate 
      };

      if (this.isEdit && this.data) {
        // Update existing appointment
        this.appointmentService.updateAppointment(this.data.num_rdv, appointmentData).subscribe({
          next: (updatedAppointment) => {
            this.appointmentCreated.emit(updatedAppointment);
            this.dialogRef.close({ ...updatedAppointment, time_rdv });
          },
          error: (error) => {
            console.error('Error updating appointment:', error);
          }
        });
      } else {
        // Create new appointment
        this.appointmentService.createAppointment(appointmentData).subscribe({
          next: (createdAppointment) => {
            this.appointmentCreated.emit(createdAppointment);
            this.dialogRef.close({ ...createdAppointment, time_rdv });
          },
          error: (error) => {
            console.error('Error creating appointment:', error);
          }
        });
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
} 