import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Observable, Subject } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { BackendService } from '../backend.service';
import { PatientResponse } from '../patient-response.model';
import { Patient } from '../patient.model';

@Component({
  selector: 'app-reader',
  templateUrl: './reader.component.html',
  styleUrls: ['./reader.component.css'],
})
export class ReaderComponent implements OnInit {
  patients: Patient[] = [];
  private searchTerms = new Subject<string>();
  patientsResponse$!: Observable<PatientResponse>;
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

  constructor(private backendService: BackendService) {}

  ngOnInit(): void {
    this.patientsResponse$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      // distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((term: string) =>
        this.backendService.searchAllPatients(term, this.queryParams)
      )
    );
    this.patientsResponse$.subscribe(({ count, rows }) => {
      this.paginatorData.length = count;
      this.patients = rows;
      if (this.patients.length <= 0) {
        // display notification
      }
    });
    this.search('');
  }

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
