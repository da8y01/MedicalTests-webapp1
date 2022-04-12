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
    documentType: ['', Validators.required],
    password: ['', Validators.required],
    username: ['', Validators.required],
    birthdate: ['', Validators.required],
    address: ['', Validators.required],
    phone: ['', Validators.required],
    email: ['', Validators.required],
    email2: [''],
  });
  messages = '';
  termPatient: string = '';
  assignedPatients: string[] = [];
  populatedPatients: Patient[] = [];
  showPatientValidation = false;

  constructor(
    private fb: FormBuilder,
    private backendService: BackendService,
    private router: Router
  ) {}

  ngOnInit() {}

  onSubmit() {
    // TODO: Use EventEmitter with form value
    let sentMedic = { ...this.medicForm.value, roles: ['medic'] };
    sentMedic.password = sentMedic.username;
    this.backendService.createPatient(sentMedic).subscribe(
      (res) => {
        this.backendService
          .assignPatients(sentMedic.username, this.assignedPatients)
          .subscribe(
            (patients) => console.info(patients),
            (error) => console.error(error)
          );
        this.router.navigate(['/admin']);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  addPatient(document: string): void {
    this.backendService.getUser(parseInt(document)).subscribe(
      (user) => {
        if (user.id) {
          this.assignedPatients.push(user.username);
          this.populatedPatients.push(user);
          this.showPatientValidation = false;
        } else {
          this.showPatientValidation = true;
        }
        // this.assignedPatients.push({})
      },
      (error) => console.error(error)
    );
  }
}
