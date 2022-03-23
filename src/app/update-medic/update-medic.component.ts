import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BackendService } from '../backend.service';
import { Patient } from '../patient.model';

@Component({
  selector: 'app-update-medic',
  templateUrl: './update-medic.component.html',
  styleUrls: ['./update-medic.component.css'],
})
export class UpdateMedicComponent implements OnInit {
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
  userRoute: Patient;
  medicId: number = 0;
  patientsLength: number = 0;
  termPatient: string = '';
  deletePatients: number[] = [];
  populatedPatients: Patient[] = []

  constructor(
    private fb: FormBuilder,
    private backendService: BackendService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.userRoute = this.activatedRoute.snapshot.data.user;
  }

  ngOnInit(): void {
    let medicFormValue = { ...this.userRoute };
    delete medicFormValue['id'];
    delete medicFormValue['medic'];
    delete medicFormValue['createdAt'];
    delete medicFormValue['updatedAt'];
    medicFormValue = {
      ...medicFormValue,
      documentType: 'CC',
      birthdate: '01/01/1991',
    };
    this.medicForm.setValue(medicFormValue);
    this.medicId = this.userRoute.id;
    this.getMedicPatients()
  }

  onSubmit() {
    const userServer = { ...this.medicForm.value, id: this.medicId };
    this.backendService.updatePatient(userServer).subscribe(
      (updatedUser) => {
        this.router.navigate(['/admin']);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  countPatients(event: number): number {
    this.patientsLength = event;
    return this.patientsLength;
  }
  updateDeleteListPatients(deleteList: number[]) {
    this.deletePatients = deleteList;
  }

  getMedicPatients(): void {
    this.backendService.getPatients(this.userRoute.id).subscribe(patients => {
      // console.info(patients)
      // patients.map(patient => this.populatedPatients.push(patient))
      // console.info(this.populatedPatients)
      this.populatedPatients = patients
    }, error => console.error(error));
  }
}
