import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit {
  patientsLength: number = 0;
  medicsLength: number = 0;
  termPatient: string = '';
  termMedic: string = '';

  constructor() {}

  ngOnInit(): void {}

  countPatients(event: number): number {
    this.patientsLength = event;
    return this.patientsLength;
  }
  countMedics(event: number): number {
    this.medicsLength = event;
    return this.medicsLength;
  }

  searchPatient(term: string): void {
    this.termPatient = term;
  }
  searchMedic(term: string): void {
    this.termMedic = term;
  }
}
