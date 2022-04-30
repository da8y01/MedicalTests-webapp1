import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subject } from 'rxjs';
import { Patient } from '../patient.model';

@Component({
  selector: 'app-reader',
  templateUrl: './reader.component.html',
  styleUrls: ['./reader.component.css'],
})
export class ReaderComponent implements OnInit {
  patients: Patient[] = [];
  private searchTerms = new Subject<string>();
  paginatorData = {
    length: 0,
    pageSize: 5,
  };
  queryParams = {
    offset: 0,
    limit: 5,
  };

  selectedPatient?: Patient;
  onSelect(patient: Patient): void {
    this.selectedPatient = patient;
  }

  constructor() {}

  ngOnInit(): void {}

  pageEvent(event: PageEvent): void {
    this.queryParams.limit = this.paginatorData.pageSize;
    this.queryParams.offset = this.paginatorData.pageSize * event.pageIndex;
    this.search('');
  }

  // Push a search term into the observable stream.
  search(term: string, event?: Event): void {
    if (event) event.preventDefault();
    this.searchTerms.next(term);
  }
}
