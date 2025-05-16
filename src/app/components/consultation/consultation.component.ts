import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface ConsultationHistory {
  id: number;
  date: Date;
  diagnosis: string;
  symptoms: string;
  treatment: string;
  vitals: {
    temperature: number;
    systolicBP: number;
    diastolicBP: number;
    spo2: number;
    weight: number;
    height: number;
    bpm: number;
  };
  notes: string;
}

@Component({
  selector: 'app-consultation',
  templateUrl: './consultation.component.html',
  styleUrls: ['./consultation.component.scss']
})
export class ConsultationComponent implements OnInit {
  patient: any;
  consultationForm: FormGroup;
  consultationHistory: ConsultationHistory[] = [];
  selectedHistory: ConsultationHistory | null = null;

  constructor(
    public router: Router,
    private fb: FormBuilder
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.patient = navigation?.extras.state?.['patient'];
    
    if (!this.patient) {
      this.router.navigate(['/patients']);
    }

    this.consultationForm = this.fb.group({
      // Vital Signs
      temperature: ['', [Validators.required, Validators.min(35), Validators.max(42)]],
      systolicBP: ['', [Validators.required, Validators.min(70), Validators.max(200)]],
      diastolicBP: ['', [Validators.required, Validators.min(40), Validators.max(130)]],
      spo2: ['', [Validators.required, Validators.min(70), Validators.max(100)]],
      weight: ['', [Validators.required, Validators.min(0), Validators.max(500)]],
      height: ['', [Validators.required, Validators.min(0), Validators.max(300)]],
      bpm: ['', [Validators.required, Validators.min(40), Validators.max(200)]],
      
      // Existing fields
      symptoms: ['', Validators.required],
      diagnosis: ['', Validators.required],
      treatment: ['', Validators.required],
      notes: ['']
    });

    // Mock history data
    this.consultationHistory = this.getMockConsultationHistory();
  }

  ngOnInit(): void {
    // Add any initialization logic here if needed
  }

  onSubmit(): void {
    if (this.consultationForm.valid) {
      const consultationData = {
        patientId: this.patient.id,
        date: new Date(),
        ...this.consultationForm.value
      };
      console.log('Consultation Data:', consultationData);
      // Here you would typically save the consultation data
      this.router.navigate(['/patients']);
    }
  }

  viewHistoryDetails(history: ConsultationHistory): void {
    this.selectedHistory = history;
    // Optionally, you could show this in a dialog or populate a details section
    console.log('Viewing history:', history);
  }

  private getMockConsultationHistory(): ConsultationHistory[] {
    return [
      {
        id: 1,
        date: new Date('2024-03-15'),
        diagnosis: 'Common Cold',
        symptoms: 'Fever, runny nose, sore throat',
        treatment: 'Prescribed cold medicine and rest',
        vitals: {
          temperature: 37.8,
          systolicBP: 120,
          diastolicBP: 80,
          spo2: 98,
          weight: 70,
          height: 170,
          bpm: 75
        },
        notes: 'Follow up in 1 week if symptoms persist'
      },
      {
        id: 2,
        date: new Date('2024-02-01'),
        diagnosis: 'Annual Check-up',
        symptoms: 'None',
        treatment: 'No treatment needed',
        vitals: {
          temperature: 36.6,
          systolicBP: 118,
          diastolicBP: 78,
          spo2: 99,
          weight: 71,
          height: 170,
          bpm: 72
        },
        notes: 'All vitals normal'
      },
      // Add more mock history items as needed
    ];
  }
} 