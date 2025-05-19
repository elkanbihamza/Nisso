import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-consultation-history-dialog',
  templateUrl: './consultation-history-dialog.component.html',
  styleUrls: ['./consultation-history-dialog.component.css']
})
export class ConsultationHistoryDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
  ){
    
  }
}
