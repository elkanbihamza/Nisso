import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Consultation } from '../../interfaces/consultation.interface';
import { ConsultationService } from '../../services/consultation.service';



@Component({
  selector: 'app-consultation',
  templateUrl: './consultation.component.html',
  styleUrls: ['./consultation.component.scss']
})
export class ConsultationComponent implements OnInit {
  patient: any;
  consultationForm: FormGroup;
  consultationHistory: Consultation[] = [];
  selectedHistory: Consultation | null = null;

  constructor(
    public router: Router,
    private fb: FormBuilder,
    private consultationService: ConsultationService
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.patient = navigation?.extras.state?.['patient'];
    console.log(this.patient, "dddd")
    if (!this.patient) {
      this.router.navigate(['/patients']);
    }

    this.consultationForm = this.fb.group({
      motif: [''],
      temperature: [''],
      symptomes: [''],
      tension_arterielle_systolique: [''],
      tension_arterielle_diastolique: [''],
      saturation_oxygene: [''],
      frequence_cardiaque: [''],
      poids: [''],
      taille: [''],
      diagnostic_principal: [''],
      traitement: ['']
    });

    // Mock history data
    this.consultationHistory = [];
  }

  ngOnInit(): void {
    // Add any initialization logic here if needed
  }

  onSubmit(): void {
  if (this.consultationForm.valid) {
    const consultationData = {
      id_patient: this.patient.id_patient,  // use backend field name exactly
      date: new Date(),
      ...this.consultationForm.value
    };
    console.log('Consultation Data:', consultationData);

    this.consultationService.createConsultation(consultationData).subscribe({
      next: (createdConsultation) => {
        console.log('Consultation created:', createdConsultation);
        this.router.navigate(['/patients']);
      },
      error: (error) => {
        console.error('Error creating consultation:', error);
        // Optionally display error feedback to the user
      }
    });
  }
}


  viewHistoryDetails(history: Consultation): void {
    this.selectedHistory = history;
    // Optionally, you could show this in a dialog or populate a details section
    console.log('Viewing history:', history);
  }

  
} 