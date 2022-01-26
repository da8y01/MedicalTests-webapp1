import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { BackendService } from '../backend.service';
import { Result } from '../result.model';

@Component({
  selector: 'app-results-list',
  templateUrl: './results-list.component.html',
  styleUrls: ['./results-list.component.css'],
})
export class ResultsListComponent implements OnInit {
  results: Result[] = [];
  paginatorData = {
    length: 0,
    pageSize: 10,
  };
  queryParams = {
    offset: 0,
    limit: 10,
  };

  constructor(private backendService: BackendService) {}

  ngOnInit(): void {
    this.getResults(this.queryParams);
  }

  getResults(queryParams: { offset: number; limit: number }): void {
    this.backendService.getResults(queryParams).subscribe((results) => {
      this.paginatorData.length = results.count;
      this.results = results.rows;
    });
  }

  pageEvent(event: PageEvent): void {
    console.log(event);
    this.queryParams.limit = this.paginatorData.pageSize;
    this.queryParams.offset = this.paginatorData.pageSize * event.pageIndex;
    this.getResults(this.queryParams);
  }
}
