import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PatientService } from '../../../services/patient.service';

@Component({
  selector: 'app-create-patient',
  templateUrl: './create-patient.component.html',
  styleUrls: ['./create-patient.component.scss']
})
export class CreatePatientComponent implements OnInit {
  patientForm: FormGroup;
  isEdit = false;
  patientId: number | null = null;
  isSubmitting: boolean;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private patientService: PatientService
  ) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { patient: any, isEdit: boolean };

    this.isEdit = state?.isEdit || false;
    
    this.isSubmitting = false;
    
    this.patientForm = this.fb.group({
      prenom_patient: ['', Validators.required],
      nom_patient: ['', Validators.required],
      date_naissance: [''],
      adresse: [''],
      telephone: [''],
      assurance: [''],
      CIN: [''],
      email: [''],
    });

    if (state?.patient) {
      this.patientId = state.patient.id_patient;
      this.patientForm.patchValue(state.patient);
    }
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.patientForm.invalid) return;
  
    this.isSubmitting = true;
    const formData = this.patientForm.value;
  
    const request$ = this.isEdit && this.patientId !== null
      ? this.patientService.updatePatient(this.patientId, formData)
      : this.patientService.createPatient(formData);
  
    request$.subscribe({
      next: () => this.router.navigate(['/patients']),
      error: (err) => {
        console.error('Error saving patient:', err);
        this.isSubmitting = false;
      }
    });
  }
} 