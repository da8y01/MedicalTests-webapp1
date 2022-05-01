import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BackendService } from '../backend.service';
import { Patient } from '../patient.model';

@Component({
  selector: 'app-update-readings',
  templateUrl: './update-readings.component.html',
  styleUrls: ['./update-readings.component.css'],
})
export class UpdateReadingsComponent implements OnInit {
  loggedUserId: number = 0;
  userRoute: Patient;

  constructor(private activatedRoute: ActivatedRoute) {
    this.userRoute = this.activatedRoute.snapshot.data.user;
  }

  ngOnInit(): void {
    this.loggedUserId = this.userRoute.id;
  }
}
