import { Component, OnInit } from '@angular/core';
import { BackendService } from '../backend.service';
import { Patient } from '../patient.model';

@Component({
  selector: 'app-medic',
  templateUrl: './medic.component.html',
  styleUrls: ['./medic.component.css'],
})
export class MedicComponent implements OnInit {
  patients: Patient[] = [];

  constructor(private backendService: BackendService) {}

  ngOnInit(): void {
    this.getPatients();
  }

  getPatients(): void {
    this.backendService
      .getPatients()
      .subscribe((patients) => (this.patients = patients));
  }
}
