import { Component, OnInit } from '@angular/core';
import { BackendService } from '../backend.service';

@Component({
  selector: 'app-update-readings',
  templateUrl: './update-readings.component.html',
  styleUrls: ['./update-readings.component.css']
})
export class UpdateReadingsComponent implements OnInit {
  loggedUserId: number = 0

  constructor(private backendService: BackendService) { }

  ngOnInit(): void {
    this.loggedUserId = this.backendService.getLocalStorageUser().id
  }

}
