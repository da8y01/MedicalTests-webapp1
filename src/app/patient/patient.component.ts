import { Component, OnInit } from '@angular/core';
import { BackendService } from '../backend.service';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.css']
})
export class PatientComponent implements OnInit {
  loggedUserId: number = 0

  constructor(private backendService: BackendService) {}

  ngOnInit(): void {
    this.loggedUserId = this.backendService.getLocalStorageUser().id
  }
}
