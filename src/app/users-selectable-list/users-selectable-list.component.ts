import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormArray } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { BackendService } from '../backend.service';
import { PatientResponse } from '../patient-response.model';
import { Patient } from '../patient.model';

@Component({
  selector: 'app-users-selectable-list',
  templateUrl: './users-selectable-list.component.html',
  styleUrls: ['./users-selectable-list.component.css'],
})
export class UsersSelectableListComponent implements OnInit {
  @Input('role') inputRole: string = '';
  @Input('term') inputTerm: string = '';
  @Input('selectable') inputSelectable: boolean = true;
  @Output() usersCount = new EventEmitter<number>();
  @Output() usersDelete = new EventEmitter<string[]>();
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
  ) { }

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

  checkClick(userName: string, index: number) {
    if (this.usersList.controls[index].value) {
      this.deleteSet.add(userName);
    } else {
      this.deleteSet.delete(userName);
    }
    this.usersDelete.emit([...this.deleteSet] as string[]);
  }

  checkAllClick() {
    const checkAllValue = this.selectableGroup.get('checkAll')?.value;
    this.users.map((user, idx) => {
      this.deleteSet.add(user.username);
      // if (checkAllValue) this.deleteSet.add(user.id);
      // else this.deleteSet.delete(user.id);
      this.usersList.controls[idx].setValue(checkAllValue);
    });
    if (!checkAllValue) this.deleteSet.clear();
    this.usersDelete.emit([...this.deleteSet] as string[]);
    // this.usersDelete.emit([...this.deleteSet]);
  }
}
