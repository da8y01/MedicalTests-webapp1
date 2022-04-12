import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { BackendService } from '../backend.service';
import { Patient } from '../patient.model';

@Component({
  selector: 'app-users-populated-list',
  templateUrl: './users-populated-list.component.html',
  styleUrls: ['./users-populated-list.component.css'],
})
export class UsersPopulatedListComponent implements OnInit, OnChanges {
  // @Input('pre-populated') inputPrePopulated: Patient[] = [];
  @Input('pre-populated') inputPrePopulated: Patient[];
  @Input('delete-remote') deleteRemote?: boolean = false;
  prePopulatedCopy: Patient[] = [];
  showValidation = false;

  constructor(private backendService: BackendService) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    Object.assign(this.prePopulatedCopy, changes.inputPrePopulated.currentValue)
  }

  deletePatient(index: number, event: Event) {
    event.preventDefault();
    const result = confirm(
      '[ALERTA] Está seguro que desea eliminar el elemento?'
    );
    if (result && !this.deleteRemote) {
      this.inputPrePopulated.splice(index, 1);
    }
    if (result && this.deleteRemote) {
      this.backendService
        .undoAssignPatients([this.inputPrePopulated[index].username])
        .subscribe(
          (updatedPatients) => {
            if (updatedPatients.length === 1)
              this.inputPrePopulated.splice(index, 1);
          },
          (error) => console.error(error)
        );
    }
  }

  searchLocal(term: string, event: Event) {
    event.preventDefault();
    if (term === '') {
      this.inputPrePopulated = [...this.prePopulatedCopy];
      this.showValidation = false;
    }
    if (term !== '') {
      this.inputPrePopulated = this.inputPrePopulated.filter((prePopulated) => {
        return prePopulated.username.includes(term);
      });
    }
    if (this.inputPrePopulated.length === 0) this.showValidation = true;
  }
}
