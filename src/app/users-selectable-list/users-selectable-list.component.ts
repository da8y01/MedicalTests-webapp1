import { Component, Input, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { BackendService } from '../backend.service';
import { PatientResponse } from '../patient-response.model';
import { Patient } from '../patient.model';
import { QueryParams } from '../query-params.model';

@Component({
  selector: 'app-users-selectable-list',
  templateUrl: './users-selectable-list.component.html',
  styleUrls: ['./users-selectable-list.component.css'],
})
export class UsersSelectableListComponent implements OnInit {
  @Input() role: string = '';
  roleText = '';
  paginatorData = {
    length: 0,
    pageSize: 5,
  };
  queryParams = {
    offset: 0,
    limit: 10,
  };
  usersResponse$!: Observable<PatientResponse>;
  users: Patient[] = [];
  private searchTerms = new Subject<string>();

  constructor(private backendService: BackendService) {}

  ngOnInit(): void {
    this.roleText = this.role === 'patient' ? 'PACIENTE' : 'REMISOR';
    const fullQueryParams = Object.assign(this.queryParams, {
      roles: [this.role],
    });
    this.usersResponse$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      // distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((term: string) =>
        this.backendService.searchUsers(term, fullQueryParams)
      )
    );
    this.usersResponse$.subscribe(({ count, rows }) => {
      this.paginatorData.length = count;
      this.users = rows;
      if (this.users.length <= 0) {
        // display notification
      }
    });
    this.search('');
  }

  getUsers(queryParams: QueryParams): void {
    this.backendService.getPatients().subscribe((res) => {
      this.paginatorData.length = res.count;
      this.users = res.rows;
    });
  }

  pageEvent(event: any): void {
    this.queryParams.limit = this.paginatorData.pageSize;
    this.queryParams.offset = this.paginatorData.pageSize * event.pageIndex;
    this.search('');
  }

  search(term: string): void {
    this.searchTerms.next(term);
  }
}