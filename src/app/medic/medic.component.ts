import { Component, OnInit } from '@angular/core';

import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { BackendService } from '../backend.service';
import { Patient } from '../patient.model';

@Component({
  selector: 'app-medic',
  templateUrl: './medic.component.html',
  styleUrls: ['./medic.component.css'],
})
export class MedicComponent implements OnInit {
  patients$!: Observable<Patient[]>;
  patients: Patient[] = [];
  private searchTerms = new Subject<string>();

  constructor(private backendService: BackendService) {}

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.patients$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((term: string) => this.backendService.searchPatients(term))
    );
    this.patients$.subscribe(result => this.patients = result);
    this.search('');
  }

  selectedPatient?: Patient;
  onSelect(patient: Patient): void {
    this.selectedPatient = patient;
  }
}
