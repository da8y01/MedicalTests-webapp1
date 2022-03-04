import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BackendService } from '../backend.service';

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

  constructor(
    private fb: FormBuilder,
    private backendService: BackendService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  onSubmit() {
    // TODO: Use EventEmitter with form value
    this.backendService
      .createPatient({ ...this.medicForm.value, roles: ['medic'] })
      .subscribe(
        (res) => {
          this.router.navigate(['/admin']);
        },
        (error) => {
          console.error(error);
        }
      );
  }
}
