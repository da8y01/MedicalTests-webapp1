import { Component, OnInit } from '@angular/core';
import { BackendService } from '../backend.service';
import { Result } from '../result.model';

@Component({
  selector: 'app-results-list',
  templateUrl: './results-list.component.html',
  styleUrls: ['./results-list.component.css'],
})
export class ResultsListComponent implements OnInit {
  results: Result[] = [];

  constructor(private backendService: BackendService) {}

  ngOnInit(): void {
    this.getResults();
  }

  getResults(): void {
    this.backendService
      .getResults()
      .subscribe((results) => (this.results = results));
  }
}
