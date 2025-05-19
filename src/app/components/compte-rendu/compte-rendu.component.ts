import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-compte-rendu',
  templateUrl: './compte-rendu.component.html',
  styleUrls: ['./compte-rendu.component.scss']
})
export class CompteRenduComponent implements OnInit {
  patient: any;
  compteRenduHistory: any[] = [];
  selectedHistory: any | null = null;

  constructor() { }

  ngOnInit(): void {
    // Initialize with empty history for now
    this.compteRenduHistory = [];
  }

  viewHistoryDetails(history: any): void {
    this.selectedHistory = history;
    // Implement history viewing logic
  }
} 