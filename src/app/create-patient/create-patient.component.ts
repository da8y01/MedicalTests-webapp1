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
  listFormData: FormData[] = [];

  constructor(
    private fb: FormBuilder,
    private backendService: BackendService,
    private el: ElementRef,
    private router: Router
  ) {}

  ngOnInit(): void {}

  onSubmit() {
    // TODO: Use EventEmitter with form value
    const patientFormValue = { ...this.patientForm.value };
    delete patientFormValue['examsArray'];
    delete this.patientForm.value['examsArray'];
    this.backendService.createPatient(this.patientForm.value).subscribe(
      (res) => {
        console.info(res);
        this.triggerUploads(res.username);
        // this.router.navigate(['/admin']);
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
    event.preventDefault();
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

  async triggerUploads(patientUsername: string) {
    try {
      const uploads = await this.listFormData.map(async (formData) => {
        // const upload$ = await this.backendService.uploadResult(formData);
        const result = await this.backendService.uploadResult2(formData, patientUsername);
        return result;
        // .pipe(finalize(() => this.reset())).toPromise();

        // console.info(upload$);
        // this.uploadSub = upload$.subscribe(
        //   (event) => {
        //     if (event.type == HttpEventType.UploadProgress) {
        //       this.uploadProgress = Math.round(
        //         100 * (event.loaded / event.total)
        //       );
        //       console.info(this.uploadProgress);
        //     }
        //     if (event.type == HttpEventType.Sent) {
        //       console.info(event);
        //       // this.router.navigate(['/admin']);
        //     }
        //   },
        //   (error) => console.error(error)
        // );
      });
      await Promise.all(uploads)
        .then((uploads) => {
          console.info(uploads);
        })
        .catch((error) => console.error(error));
    } catch (error) {
      console.error(error);
    }
  }

  onFileExam(event: any, index: number, filename?: string) {
    const file: File = event.target.files[0];
    if (file) {
      let filenameFinal = file.name;
      if (filename) {
        let filenameTrimmed = filename.trim();
        if (filenameTrimmed !== '') {
          filenameFinal = filenameTrimmed.replace(/^\s+|\s+$/gm, '_');
        } else {
          filenameFinal = file.name.replace(/^\s+|\s+$/gm, '_');
        }
      } else {
        filenameFinal = file.name.replace(/^\s+|\s+$/gm, '_');
      }
      // const extension = file.name.split('.').pop();
      // const extension = file.name.substring(file.name.lastIndexOf('.') + 1);
      // const extension = file.name.slice((file.name.lastIndexOf(".") - 1 >>> 0) + 2);
      const extension = file.name.slice((Math.max(0, file.name.lastIndexOf(".")) || Infinity) + 1);
      filenameFinal = `${filenameFinal}.${extension}`;
      const formData = new FormData();
      formData.append('exam', file, filenameFinal);
      this.listFormData.push(formData);
    }
  }

  onFileReading(event: any, index: number) {
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
