import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PatientService } from '../../../services/patient.service';
import { Patient } from '../../../interfaces/patient.interface';

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

    console.log("this.data", this.data)
    
    this.appointmentForm = this.fb.group({
      id_patient: [''],
      num_rdv: ['', Validators.required],
      date_rdv: ['', Validators.required],
      motif: ['', Validators.required]
    });

    if (this.isEdit && data) {
      this.appointmentForm.patchValue(data);
    }
  }

  ngOnInit(): void {
    if(!this.isEdit){
    this.patientService.getPatients().subscribe(
      patients => this.patients = patients
    );
    }
    
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