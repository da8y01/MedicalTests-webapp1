import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BackendService } from '../backend.service';
import { Patient } from '../patient.model';

@Component({
  selector: 'app-update-patient',
  templateUrl: './update-patient.component.html',
  styleUrls: ['./update-patient.component.css'],
})
export class UpdatePatientComponent implements OnInit {
  patientForm = this.fb.group({
    firstName: [{ value: '', disabled: true }, Validators.required],
    lastName: [{ value: '', disabled: true }, Validators.required],
    documentType: [{ value: '', disabled: true }],
    password: [{ value: '', disabled: true }, Validators.required],
    username: [{ value: '', disabled: true }, Validators.required],
    birthdate: [{ value: '', disabled: true }],
    address: [{ value: '', disabled: true }],
    phone: [{ value: '', disabled: true }],
    email: [{ value: '', disabled: true }, Validators.required],
  });
  userRoute: Patient;

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private backendService: BackendService
  ) {
    this.userRoute = this.activatedRoute.snapshot.data.user;
  }

  ngOnInit(): void {
    let patientFormValue = { ...this.userRoute };
    delete patientFormValue['id']
    delete patientFormValue['medic']
    delete patientFormValue['createdAt']
    delete patientFormValue['updatedAt']
    patientFormValue = {
      ...patientFormValue,
      documentType: 'CC',
      birthdate: '01/01/1991',
    };
    this.patientForm.setValue(patientFormValue);
  }

  onSubmit() {
    console.info('onSubmit');
  }

  editField(field: string) {
    console.info(field);
  }
}
