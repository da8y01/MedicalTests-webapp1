import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
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
  listFormData: { exam: FormData; reading: FormData }[] = [];
  dummyExams = []

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
    const birthdate = new Date(patientFormValue.birthdate)
    let month = `${birthdate.getMonth()}`
    if (parseInt(month) <= 9) month = `0${month}`
    delete patientFormValue['id'];
    delete patientFormValue['medic'];
    delete patientFormValue['createdAt'];
    delete patientFormValue['updatedAt'];
    delete patientFormValue['password'];
    patientFormValue = {
      ...patientFormValue,
      documentType: "1",
      birthdate: `${birthdate.getFullYear()}-${month}-${birthdate.getDate()}`,
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

  get examsList() {
    return this.patientForm.get('examsArray') as FormArray;
  }

  addExam(event: Event) {
    event.preventDefault();
    const exam = {
      name: [''],
      result: [''],
      reading: [''],
      date: [''],
    };
    // this.examsList.push(this.fb.group(exam));
    this.dummyExams.push(this.fb.group(exam));
  }

  onFileExam(event: any, filename?: string, index?: number) {
    const file: File = event.target.files[0];
    if (file) {
      let filenameFinal = file.name.trim().replace(/\s+/gm, '_');
      if (filename) filenameFinal = filename.trim().replace(/\s+/gm, '_');
      // const extension = file.name.split('.').pop();
      // const extension = file.name.substring(file.name.lastIndexOf('.') + 1);
      // const extension = file.name.slice((file.name.lastIndexOf(".") - 1 >>> 0) + 2);
      const extension = file.name.slice(
        (Math.max(0, file.name.lastIndexOf('.')) || Infinity) + 1
      );
      filenameFinal = `${filenameFinal}.${extension}`;
      const formData = new FormData();
      // let formData = new FormData();
      formData.append('exam', file, filenameFinal);
      // this.currentFormDataItem.exam = formData;
      // this.listFormData.push(this.currentFormDataItem);
      this.listFormData.push({ exam: formData, reading: null });
      // this.listFormData[index] = this.currentFormDataItem;
    }
  }

  onFileReading(event: any, index?: number) {
    const file: File = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('reading', file, file.name.trim().replace(/\s+/gm, '_'));
      this.listFormData[index].reading = formData;
    }
  }

  editField(field: string) {
    console.info(field);
  }
}
