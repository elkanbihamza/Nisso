import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PatientService, Patient } from '../../../services/patient.service';

@Component({
  selector: 'app-create-appointment-dialog',
  templateUrl: './create-appointment-dialog.component.html',
  styleUrls: ['./create-appointment-dialog.component.scss']
})
export class CreateAppointmentDialogComponent {
  appointmentForm: FormGroup;
  isEdit: boolean;
  patients: Patient[] = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CreateAppointmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private patientService: PatientService
  ) {
    this.isEdit = data?.isEdit || false;
    
    this.appointmentForm = this.fb.group({
      num_rdv: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      reason: ['', Validators.required]
    });

    if (this.isEdit && data) {
      this.appointmentForm.patchValue(data);
    }
  }

  ngOnInit(): void {
    this.patientService.getPatients().subscribe(
      patients => this.patients = patients
    );
  }

  onSubmit(): void {
    if (this.appointmentForm.valid) {
      this.dialogRef.close(this.appointmentForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
} 