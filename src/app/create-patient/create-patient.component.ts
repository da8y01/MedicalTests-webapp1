import { HttpEventType } from '@angular/common/http';
import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { BackendService } from '../backend.service';
// import { FileUploader, FileSelectDirective } from 'ng2-file-upload';
// import { FileUploader } from 'ng2-file-upload';
// import {  FileUploader } from 'ng2-file-upload/ng2-file-upload';
// import { environment } from 'src/environments/environment';

// const URL = '/api/';
// const URL = `${environment.apiUrl}/results/upload`;
// const URL = 'https://evening-anchorage-3159.herokuapp.com/api/';

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
    // fileUpload: ['', Validators.required],
  });
  messages = '';
  fileName = '';
  uploadProgress!: number;
  uploadSub!: Subscription;
  // uploadUrl = `${environment.apiUrl}/results/upload`
  // public uploader:FileUploader = new FileUploader({url: this.uploadUrl});
  // uploader:FileUploader;
  // hasBaseDropZoneOver:boolean;
  // hasAnotherDropZoneOver:boolean;
  // response:string;
  // declare a property called fileuploader and assign it to an instance of a new fileUploader.
  // pass in the Url to be uploaded to, and pass the itemAlias, which would be the name of the //file input when sending the post request.
  // public uploader: FileUploader = new FileUploader({
  //   url: URL,
  //   itemAlias: 'result',
  // });

  constructor(
    private fb: FormBuilder,
    private backendService: BackendService,
    private el: ElementRef,
    private router: Router
  ) {
    // this.uploader = new FileUploader({
    //   url: URL,
    //   disableMultipart: true, // 'DisableMultipart' must be 'true' for formatDataFunction to be called.
    //   formatDataFunctionIsAsync: true,
    //   formatDataFunction: async (item: any) => {
    //     console.info(item)
    //     return new Promise( (resolve, reject) => {
    //       resolve({
    //         name: item._file.name,
    //         length: item._file.size,
    //         contentType: item._file.type,
    //         date: new Date()
    //       });
    //     });
    //   }
    // });
    // this.hasBaseDropZoneOver = false;
    // this.hasAnotherDropZoneOver = false;
    // this.response = '';
    // this.uploader.response.subscribe( res => this.response = res );
  }

  ngOnInit(): void {
    // // override the onAfterAddingfile property of the uploader so it doesn't authenticate with
    // // credentials.
    // this.uploader.onAfterAddingFile = (file) => {
    //   file.withCredentials = false;
    // };
    // // overide the onCompleteItem property of the uploader so we are
    // // able to deal with the server response.
    // this.uploader.onCompleteItem = (
    //   item: any,
    //   response: any,
    //   status: any,
    //   headers: any
    // ) => {
    //   console.log('ImageUpload:uploaded:', item, status, response);
    // };
  }

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

  // public fileOverBase(e:any):void {
  //   this.hasBaseDropZoneOver = e;
  // }

  // public fileOverAnother(e:any):void {
  //   this.hasAnotherDropZoneOver = e;
  // }
  // the function which handles the file upload without using a plugin.
  upload() {
    // locate the file element meant for the file upload.
    let inputEl: HTMLInputElement =
      this.el.nativeElement.querySelector('#fileUpload');
    // get the total amount of files attached to the file input.
    let fileCount: number = inputEl.files.length;
    // create a new fromdata instance
    let formData = new FormData();
    // check if the filecount is greater than zero, to be sure a file was selected.
    if (fileCount > 0) {
      // a file was selected
      // append the key name 'photo' with the first file in the element
      formData.append('result', inputEl.files.item(0));
      // call the angular http method
      // this.http
      // // post the form data to the url defined above and map the response. Then subscribe
      // // to initiate the post. if you don't subscribe, angular wont post.
      //   .post(URL, formData).map((res:Response) => res.json()).subscribe(
      //     // map the success function and alert the response
      //     (success) => {
      //       alert(success._body);
      //     },
      //     (error) => alert(error)
      //   )
      this.backendService.uploadResult(formData).subscribe(
        (res) => {
          console.info(res);
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }
}
