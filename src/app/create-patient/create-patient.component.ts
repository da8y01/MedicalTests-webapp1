import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BackendService } from '../backend.service';

@Component({
  selector: 'app-create-patient',
  templateUrl: './create-patient.component.html',
  styleUrls: ['./create-patient.component.css'],
})
export class CreatePatientComponent implements OnInit {
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
  messages = '';

  constructor(
    private fb: FormBuilder,
    private backendService: BackendService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  onSubmit() {
    // TODO: Use EventEmitter with form value
    this.backendService.createPatient(this.patientForm.value).subscribe(
      (res) => {
        console.info(res);
        this.router.navigate(['/admin']);
      },
      (error) => {
        console.error(error);
        this.messages = error;
      }
    );
  }

  updateProfile() {
    this.patientForm.patchValue({
      firstName: '',
      address: '',
    });
  }
}
