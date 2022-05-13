import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BackendService } from '../backend.service';
import { QueryParams } from '../query-params.model';
import { Result } from '../result.model';

@Component({
  selector: 'app-results-list-reader',
  templateUrl: './results-list-reader.component.html',
  styleUrls: ['./results-list-reader.component.css'],
})
export class ResultsListReaderComponent implements OnInit {
  @Input('patient') inputPatient: number = 0;
  results: Result[] = [];
  currentUrl = '';
  paginatorData = {
    length: 0,
    pageSize: 10,
  };
  queryParams = {
    offset: 0,
    limit: 10,
    patient: 0,
  };

  constructor(public backendService: BackendService, private router: Router) {}

  ngOnInit(): void {
    this.currentUrl = this.router.url;
    this.queryParams.patient = this.inputPatient;
    this.getResults(this.queryParams);
  }

  downloadFile(url: string, event: MouseEvent) {
    event.preventDefault();
    fetch(url).then(function (t) {
      return t.blob().then((blob) => {
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        var fileName = url.substring(url.indexOf('.com/') + 5);
        a.setAttribute('download', fileName);
        a.click();
      });
    });
  }

  deleteResult(resultId: number, event: Event) {
    event.preventDefault();
    this.backendService.deleteResult(resultId).subscribe(
      (res) => {
        this.getResults(this.queryParams);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  pageEvent(event: any): void {
    this.queryParams.limit = this.paginatorData.pageSize;
    this.queryParams.offset = this.paginatorData.pageSize * event.pageIndex;
    this.getResults(this.queryParams);
  }

  getResults(queryParams: QueryParams): void {
    this.backendService.getResults(queryParams).subscribe((results) => {
      this.paginatorData.length = results.count;
      this.results = results.rows;
    });
  }
}
