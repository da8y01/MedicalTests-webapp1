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
    documentType: ['', Validators.required],
    username: ['', Validators.required],
    birthdate: ['', Validators.required],
    address: ['', Validators.required],
    phone: ['', Validators.required],
    email: ['', Validators.required],
    email2: [''],
  });
  userRoute: Patient;
  medicId: number = 0;
  patientsLength: number = 0;
  termPatient: string = '';
  deletePatients: number[] = [];
  // populatedPatients: Patient[] = [];
  populatedPatients: Patient[];
  originalAssignedPatients: Patient[];
  showPatientValidation = false;
  assignedPatients: string[] = [];

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
    delete medicFormValue['password'];
    const birthdate = new Date(medicFormValue.birthdate);
    let strMonth = '';
    let month = parseInt(`${birthdate.getMonth()}`) + 1;
    if (month <= 9) strMonth = `0${month}`;
    medicFormValue = {
      ...medicFormValue,
      birthdate: `${birthdate.getFullYear()}-${strMonth}-${birthdate.getDate()}`,
    };
    this.medicForm.setValue(medicFormValue);
    this.medicId = this.userRoute.id;
    this.getMedicPatients();
  }

  onSubmit() {
    const userServer = { ...this.medicForm.value, id: this.userRoute.id };
    this.backendService.updatePatient(userServer).subscribe(
      (updatedUser) => {
        this.backendService
          .undoAssignPatients(
            this.originalAssignedPatients.map(
              (originalAssignedPatient) => originalAssignedPatient.username
            )
          )
          .subscribe(
            (nullifiedPatients) => {
              this.backendService
                .assignPatients(
                  updatedUser.username,
                  this.populatedPatients.map(
                    (populatedPatient) => populatedPatient.username
                  )
                )
                .subscribe(
                  (updatedPatients) => {
                    this.router.navigate(['/admin']);
                  },
                  (error) => console.error(error)
                );
            },
            (error) => console.error(error)
          );
        // this.router.navigate(['/admin']);
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
    this.backendService.getPatients(this.userRoute.id).subscribe(
      (patients) => {
        // console.info(patients)
        // patients.map(patient => this.populatedPatients.push(patient))
        // console.info(this.populatedPatients)
        this.populatedPatients = patients;
        this.originalAssignedPatients = [...this.populatedPatients];
      },
      (error) => console.error(error)
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
