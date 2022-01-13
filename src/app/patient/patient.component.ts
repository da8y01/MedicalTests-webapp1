import { Component, OnInit } from '@angular/core';

import { BackendService } from '../backend.service';
import { Result } from '../result.model';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.css']
})
export class PatientComponent implements OnInit {
  results: Result[] = [];

  constructor(private backendService: BackendService) {}

  ngOnInit(): void {
    this.getResults();
  }

  getResults(): void {
    this.backendService.getResults()
        .subscribe(results => this.results = results);
  }

}
