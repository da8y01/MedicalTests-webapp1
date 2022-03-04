import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BackendService } from '../backend.service';
import { Patient } from '../patient.model';

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
  // patientForm = this.fb.group({
  //   firstName: [{ value: '', disabled: true }, Validators.required],
  //   lastName: [{ value: '', disabled: true }, Validators.required],
  //   documentType: [{ value: '', disabled: true }],
  //   password: [{ value: '', disabled: true }, Validators.required],
  //   username: [{ value: '', disabled: true }, Validators.required],
  //   birthdate: [{ value: '', disabled: true }],
  //   address: [{ value: '', disabled: true }],
  //   phone: [{ value: '', disabled: true }],
  //   email: [{ value: '', disabled: true }, Validators.required],
  // });
  userRoute: Patient;
  patientId: number = 0;

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private backendService: BackendService
  ) {
    this.userRoute = this.activatedRoute.snapshot.data.user;
  }

  ngOnInit(): void {
    let patientFormValue = { ...this.userRoute };
    delete patientFormValue['id'];
    delete patientFormValue['medic'];
    delete patientFormValue['createdAt'];
    delete patientFormValue['updatedAt'];
    patientFormValue = {
      ...patientFormValue,
      documentType: 'CC',
      birthdate: '01/01/1991',
    };
    this.patientForm.setValue(patientFormValue);
    this.patientId = this.userRoute.id;
  }

  onSubmit() {
    const userServer = { ...this.patientForm.value, id: this.patientId };
    this.backendService.updatePatient(userServer).subscribe(
      (updatedUser) => {
        this.router.navigate(['/admin']);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  editField(field: string) {
    console.info(field);
  }
}
