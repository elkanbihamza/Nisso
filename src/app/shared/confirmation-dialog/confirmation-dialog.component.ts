import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-confirmation-dialog',
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <div mat-dialog-content>
      {{ data.message }}
    </div>
    <div mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="warn" (click)="onConfirm()">Delete</button>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
    
    h2 {
      margin: 0;
      color: #d32f2f;
      font-size: 20px;
    }
    
    [mat-dialog-content] {
      margin: 20px 0;
      color: rgba(0,0,0,0.87);
      font-size: 16px;
    }
    
    [mat-dialog-actions] {
      padding: 16px 0 0;
      border-top: 1px solid rgba(0,0,0,0.12);
      margin: 16px -24px -24px;
      padding: 16px 24px;
      gap: 8px;
    }
  `],
  standalone: true,
  imports: [MatDialogModule, MatButtonModule]
})
export class ConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string; message: string }
  ) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
} 