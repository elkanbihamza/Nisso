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
    // Load consultation history from patient object
    if (this.patient && this.patient.consultations) {
      this.consultationHistory = this.patient.consultations;
    }
  }

  onSubmit(): void {
    if (this.consultationForm.valid) {
      const formValue = this.consultationForm.value;
      const consultationData = {
        ...formValue,
        temperature: parseFloat(formValue.temperature),
        tension_arterielle_systolique: parseInt(formValue.tension_arterielle_systolique, 10),
        tension_arterielle_diastolique: parseInt(formValue.tension_arterielle_diastolique, 10),
        saturation_oxygene: parseInt(formValue.saturation_oxygene, 10),
        frequence_cardiaque: parseInt(formValue.frequence_cardiaque, 10),
        poids: parseFloat(formValue.poids),
        taille: parseInt(formValue.taille, 10),
        id_patient: this.patient.id_patient
      };
      if (this.selectedHistory && this.selectedHistory.id_consultation) {
        // Update existing consultation
        this.consultationService.updateConsultation(this.selectedHistory.id_consultation, consultationData).subscribe({
          next: () => {
            if (!this.selectedHistory) return;
            const updatedConsultation = {
              ...consultationData,
              id_consultation: this.selectedHistory.id_consultation,
              created_at: this.selectedHistory.created_at,
              updated_at: new Date().toISOString()
            };
            this.consultationHistory = this.consultationHistory.map(c =>
              c.id_consultation === updatedConsultation.id_consultation ? updatedConsultation : c
            );
            this.consultationHistory = [...this.consultationHistory];
            this.consultationForm.reset();
            this.selectedHistory = null;
          },
          error: (error) => {
            console.error('Error updating consultation:', error);
          }
        });
      } else {
        // Create new consultation
        this.consultationService.createConsultation(consultationData).subscribe({
          next: (createdConsultation) => {
            this.consultationHistory = [createdConsultation, ...this.consultationHistory];
            this.consultationForm.reset();
            this.selectedHistory = null;
          },
          error: (error) => {
            console.error('Error creating consultation:', error);
          }
        });
      }
    }
  }


  viewHistoryDetails(history: Consultation): void {
    this.selectedHistory = history;
    // Patch the form with the selected consultation's data
    this.consultationForm.patchValue({
      motif: history.motif,
      temperature: history.temperature,
      symptomes: history.symptomes,
      tension_arterielle_systolique: history.tension_arterielle_systolique,
      tension_arterielle_diastolique: history.tension_arterielle_diastolique,
      saturation_oxygene: history.saturation_oxygene,
      frequence_cardiaque: history.frequence_cardiaque,
      poids: history.poids,
      taille: history.taille,
      diagnostic_principal: history.diagnostic_principal,
      traitement: history.traitement
    });
    // Optionally, you could show this in a dialog or populate a details section
    console.log('Viewing history:', history);
  }

  clearConsultationForm(): void {
    this.selectedHistory = null;
    this.consultationForm.reset();
  }
} 