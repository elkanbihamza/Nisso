import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-patient',
  templateUrl: './create-patient.component.html',
  styleUrls: ['./create-patient.component.scss']
})
export class CreatePatientComponent implements OnInit {
  patientForm: FormGroup;
  isEdit = false;
  patientId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { patient: any, isEdit: boolean };

    this.isEdit = state?.isEdit || false;
    
    this.patientForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      birth_date: ['', Validators.required],
      gender: ['', Validators.required],
      address: ['', Validators.required],
      phone_number: ['', Validators.required]
    });

    if (state?.patient) {
      this.patientId = state.patient.id;
      this.patientForm.patchValue(state.patient);
    }
  }

  ngOnInit(): void {
    // Initialize component
  }

  onSubmit(): void {
    if (this.patientForm.valid) {
      // Here you would normally call a service to save/update the patient
      this.router.navigate(['/patients']);
    }
  }
} 