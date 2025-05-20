import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { OrdonnanceService } from '../../services/ordonnance.service';

@Component({
  selector: 'app-ordonnance',
  templateUrl: './ordonnance.component.html',
  styleUrls: ['./ordonnance.component.scss']
})
export class OrdonnanceComponent implements OnInit {
  @Input() patient: any;
  ordonnanceHistory: any[] = [];
  selectedHistory: any | null = null;
  description: string = '';

  constructor(private dialog: MatDialog, private ordonnanceService: OrdonnanceService) { }

  ngOnInit(): void {
    if (this.patient && this.patient.ordonnances) {
      this.ordonnanceHistory = this.patient.ordonnances;
    }
  }

  viewHistoryDetails(history: any): void {
    this.selectedHistory = history;
    this.description = history.description;
  }

  clearOrdonnanceForm(): void {
    this.selectedHistory = null;
    this.description = '';
  }

  saveOrdonnance(): void {
    if (!this.description || !this.patient?.id_patient) return;
    if (this.selectedHistory && this.selectedHistory.num_ord) {
      // Update existing ordonnance
      const ordonnanceData = {
        num_ord: this.selectedHistory.num_ord,
        description: this.description,
        id_patient: this.patient.id_patient
      };
      this.ordonnanceService.updateOrdonnance(this.selectedHistory.num_ord, ordonnanceData).subscribe({
        next: (updatedOrdonnance) => {
          this.ordonnanceHistory = this.ordonnanceHistory.map(o =>
            o.num_ord === updatedOrdonnance.num_ord ? updatedOrdonnance : o
          );
          this.ordonnanceHistory = [...this.ordonnanceHistory];
          this.clearOrdonnanceForm();
        },
        error: (error) => {
          console.error('Error updating ordonnance:', error);
        }
      });
    } else {
      // Create new ordonnance
      const ordonnanceData = {
        description: this.description,
        id_patient: this.patient.id_patient
      };
      this.ordonnanceService.createOrdonnance(ordonnanceData).subscribe({
        next: (createdOrdonnance) => {
          this.ordonnanceHistory = [createdOrdonnance, ...this.ordonnanceHistory];
          this.clearOrdonnanceForm();
        },
        error: (error) => {
          console.error('Error creating ordonnance:', error);
        }
      });
    }
  }

  confirmDeleteOrdonnance(ordonnance: any): void {
    const dialogRef = this.dialog.open(ConfirmDeleteDialogOrdonnance);
    dialogRef.afterClosed().subscribe(result => {
      console.log("result", result)
      if (result) {
        console.log("orde", ordonnance)
        this.deleteOrdonnance(ordonnance);
      }
    });
  }

  deleteOrdonnance(ordonnance: any): void {
    if (!ordonnance.num_ord) return;
    this.ordonnanceService.deleteOrdonnance(ordonnance.num_ord).subscribe({
      next: () => {
        this.ordonnanceHistory = this.ordonnanceHistory.filter(o => o.num_ord !== ordonnance.num_ord);
        if (this.selectedHistory && this.selectedHistory.num_ord === ordonnance.num_ord) {
          this.selectedHistory = null;
          this.description = '';
        }
      },
      error: (error) => {
        console.error('Error deleting ordonnance:', error);
      }
    });
  }
}

@Component({
  selector: 'confirm-delete-dialog-ordonnance',
  template: `
    <h2 mat-dialog-title>Confirmer la suppression</h2>
    <mat-dialog-content>Voulez-vous vraiment supprimer cette ordonnance ?</mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close="false">Annuler</button>
      <button mat-raised-button color="warn" mat-dialog-close="true">Supprimer</button>
    </mat-dialog-actions>
  `
})
export class ConfirmDeleteDialogOrdonnance {} 