import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BackendService } from '../backend.service';

@Component({
  selector: 'app-update-patient',
  templateUrl: './update-patient.component.html',
  styleUrls: ['./update-patient.component.css'],
})
export class UpdatePatientComponent implements OnInit {
  patientForm = this.fb.group({
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

  constructor(
    private fb: FormBuilder,
    private backendService: BackendService
  ) {}

  ngOnInit(): void {
    this.backendService.getPatient(1).subscribe(
      (patient) => {
        console.info(patient);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  onSubmit() {
    console.info('onSubmit');
  }

  editField(field: string) {
    console.info(field);
  }
}
