import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormArray } from '@angular/forms';
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
  @Input('role') inputRole: string = '';
  @Input('term') inputTerm: string = '';
  @Output() usersCount = new EventEmitter<number>();
  @Output() usersDelete = new EventEmitter<number[]>();
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
  selectableGroup = this.fb.group({
    checkAll: this.fb.control(false),
    usersArray: this.fb.array([]),
  });
  deleteList: number[] = [];
  deleteSet = new Set();

  constructor(
    private backendService: BackendService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.roleText = this.inputRole === 'patient' ? 'PACIENTE' : 'REMISOR';
    // const fullQueryParams = Object.assign(this.queryParams, {
    //   roles: [this.inputRole],
    // });
    const fullQueryParams = { ...this.queryParams, roles: [this.inputRole] };
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
      this.users.map((user) => {
        this.addUser();
      });
      this.emitUsersCount(count);
    });
    this.search('');
  }

  ngOnChanges() {
    this.search(this.inputTerm);
  }

  get usersList() {
    return this.selectableGroup.get('usersArray') as FormArray;
  }

  addUser() {
    this.usersList.push(this.fb.control(false));
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

  emitUsersCount(value: number) {
    this.usersCount.emit(value);
  }

  checkClick(userId: number | any, index: number) {
    if (this.usersList.controls[index].value) {
      this.deleteSet.add(userId);
    } else {
      this.deleteSet.delete(userId);
    }
    this.usersDelete.emit([...this.deleteSet] as number[]);
  }

  checkAllClick() {
    const checkAllValue = this.selectableGroup.get('checkAll')?.value;
    this.users.map((user, idx) => {
      this.deleteSet.add(user.id);
      this.usersList.controls[idx].setValue(checkAllValue);
    });
    this.usersDelete.emit([...this.deleteSet] as number[]);
  }
}
