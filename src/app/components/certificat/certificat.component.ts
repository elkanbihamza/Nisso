import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-certificat',
  templateUrl: './certificat.component.html',
  styleUrls: ['./certificat.component.scss']
})
export class CertificatComponent implements OnInit {
  patient: any;
  certificatHistory: any[] = [];
  selectedHistory: any | null = null;

  constructor() { }

  ngOnInit(): void {
    // Initialize with empty history for now
    this.certificatHistory = [];
  }

  viewHistoryDetails(history: any): void {
    this.selectedHistory = history;
    // Implement history viewing logic
  }
} 