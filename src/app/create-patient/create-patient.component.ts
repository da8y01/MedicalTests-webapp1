import { HttpEventType } from '@angular/common/http';
import { Component, ElementRef, OnInit } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
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
    examsArray: this.fb.array([]),
  });
  messages = '';
  fileName = '';
  uploadProgress!: number;
  uploadSub!: Subscription;

  constructor(
    private fb: FormBuilder,
    private backendService: BackendService,
    private el: ElementRef,
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

  get examsList() {
    return this.patientForm.get('examsArray') as FormArray;
  }

  addExam(event: Event) {
    event.preventDefault()
    const exam = {
      name: [''],
      result: [''],
      reading: [''],
      date: [''],
    };
    this.examsList.push(this.fb.group(exam));
  }

  updateProfile() {
    this.patientForm.patchValue({
      firstName: '',
      address: '',
    });
  }

  onFileSelected(event: any) {
    console.info(event);
    const file: File = event.target.files[0];

    if (file) {
      this.fileName = file.name;
      const formData = new FormData();
      formData.append('result', file, file.name);

      const upload$ = this.backendService
        .uploadResult(formData)
        .pipe(finalize(() => this.reset()));

      this.uploadSub = upload$.subscribe((event) => {
        if (event.type == HttpEventType.UploadProgress) {
          this.uploadProgress = Math.round(100 * (event.loaded / event.total));
        }
      });
    }
  }

  cancelUpload() {
    this.uploadSub.unsubscribe();
    this.reset();
  }

  reset() {
    this.uploadProgress = null;
    this.uploadSub = null;
  }
}
