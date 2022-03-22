import { Component, Input, OnInit } from '@angular/core';
import { Patient } from '../patient.model';

@Component({
  selector: 'app-users-populated-list',
  templateUrl: './users-populated-list.component.html',
  styleUrls: ['./users-populated-list.component.css']
})
export class UsersPopulatedListComponent implements OnInit {
  @Input('pre-populated') inputPrePopulated: Patient[] = [];

  constructor() { }

  ngOnInit(): void {
  }
}
