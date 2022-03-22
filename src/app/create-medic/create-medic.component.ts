import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BackendService } from '../backend.service';
import { Patient } from '../patient.model';

@Component({
  selector: 'app-create-medic',
  templateUrl: './create-medic.component.html',
  styleUrls: ['./create-medic.component.css'],
})
export class CreateMedicComponent implements OnInit {
  medicForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    documentType: [''],
    password: ['', Validators.required],
    username: ['', Validators.required],
    birthdate: [''],
    address: [''],
    phone: [''],
    email: ['', Validators.required],
  });
  messages = '';
  termPatient: string = '';
  assignedPatients: string[] = []
  populatedPatients: Patient[] = []
  showPatientValidation = true

  constructor(
    private fb: FormBuilder,
    private backendService: BackendService,
    private router: Router
  ) { }

  ngOnInit(): void { }

  onSubmit() {
    // TODO: Use EventEmitter with form value
    const sentMedic = { ...this.medicForm.value, roles: ['medic'] }
    this.backendService
      .createPatient(sentMedic)
      .subscribe(
        (res) => {
          this.backendService.assignPatients(sentMedic.username, this.assignedPatients).subscribe(patients => console.info(patients), error => console.error(error))
          this.router.navigate(['/admin']);
        },
        (error) => {
          console.error(error);
        }
      );
  }

  addPatient(document: string): void {
    this.showPatientValidation = true
    this.backendService.getUser(parseInt(document)).subscribe(user => {
      if (user.id) {
        this.assignedPatients.push(user.username)
        this.populatedPatients.push(user)
        this.showPatientValidation = false
      }
      // this.assignedPatients.push({})
    }, error => console.error(error));
  }
}
