import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';

import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { BackendService } from '../backend.service';
import { PatientResponse } from '../patient-response.model';
import { Patient } from '../patient.model';

@Component({
  selector: 'app-medic',
  templateUrl: './medic.component.html',
  styleUrls: ['./medic.component.css'],
})
export class MedicComponent implements OnInit {
  patientsResponse$!: Observable<PatientResponse>;
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

  constructor(private backendService: BackendService) {}

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.patientsResponse$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      // distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((term: string) => this.backendService.searchPatients(term, this.queryParams))
    );
    this.patientsResponse$.subscribe(({ count, rows }) => {
      this.paginatorData.length = count;
      this.patients = rows;
    });
    this.search('');
  }

  selectedPatient?: Patient;
  onSelect(patient: Patient): void {
    this.selectedPatient = patient;
  }

  pageEvent(event: PageEvent): void {
    this.queryParams.limit = this.paginatorData.pageSize;
    this.queryParams.offset = this.paginatorData.pageSize * event.pageIndex;
    this.search('');
  }
}
