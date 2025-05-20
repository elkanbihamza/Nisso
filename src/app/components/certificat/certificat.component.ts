import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CertificatService } from '../../services/certificat.service';

@Component({
  selector: 'app-certificat',
  templateUrl: './certificat.component.html',
  styleUrls: ['./certificat.component.scss']
})
export class CertificatComponent implements OnInit {
  @Input() patient: any;
  certificatHistory: any[] = [];
  selectedHistory: any | null = null;
  contenu: string = '';

  constructor(private dialog: MatDialog, private certificatService: CertificatService) { }

  ngOnInit(): void {
    if (this.patient && this.patient.certificats) {
      this.certificatHistory = this.patient.certificats;
    }

    console.log("certificatHistory", this.certificatHistory);
  }

  viewHistoryDetails(history: any): void {
    this.selectedHistory = history;
    this.contenu = history.contenu;
  }

  clearCertificatForm(): void {
    this.selectedHistory = null;
    this.contenu = '';
  }

  saveCertificat(): void {
    if (!this.contenu || !this.patient?.id_patient) return;
    const certificatData = {
      contenu: this.contenu,
      id_patient: this.patient.id_patient
    };
    if (this.selectedHistory && this.selectedHistory.num_certif) {
      // Update existing certificat
      this.certificatService.updateCertificat(this.selectedHistory.num_certif, certificatData).subscribe({
        next: (updatedCertificat) => {
          this.certificatHistory = this.certificatHistory.map(c =>
            c.num_certif === updatedCertificat.num_certif ? updatedCertificat : c
          );
          this.certificatHistory = [...this.certificatHistory];
          this.clearCertificatForm();
        },
        error: (error) => {
          console.error('Error updating certificat:', error);
        }
      });
    } else {
      // Create new certificat
      this.certificatService.createCertificat(certificatData).subscribe({
        next: (createdCertificat) => {
          this.certificatHistory = [createdCertificat, ...this.certificatHistory];
          this.clearCertificatForm();
        },
        error: (error) => {
          console.error('Error creating certificat:', error);
        }
      });
    }
  }

  confirmDeleteCertificat(certificat: any): void {
    const dialogRef = this.dialog.open(ConfirmDeleteDialogCertificat);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteCertificat(certificat);
      }
    });
  }

  deleteCertificat(certificat: any): void {
    if (!certificat.num_certif) return;
    this.certificatService.deleteCertificat(certificat.num_certif).subscribe({
      next: () => {
        this.certificatHistory = this.certificatHistory.filter(c => c.num_certif !== certificat.num_certif);
        if (this.selectedHistory && this.selectedHistory.num_certif === certificat.num_certif) {
          this.selectedHistory = null;
          this.contenu = '';
        }
      },
      error: (error) => {
        console.error('Error deleting certificat:', error);
      }
    });
  }
}

@Component({
  selector: 'confirm-delete-dialog-certificat',
  template: `
    <h2 mat-dialog-title>Confirmer la suppression</h2>
    <mat-dialog-content>Voulez-vous vraiment supprimer ce certificat ?</mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close="false">Annuler</button>
      <button mat-raised-button color="warn" mat-dialog-close="true">Supprimer</button>
    </mat-dialog-actions>
  `
})
export class ConfirmDeleteDialogCertificat {} 