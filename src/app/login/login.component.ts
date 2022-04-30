import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BackendService } from '../backend.service';
import { GenericResponse } from '../generic-response.model';
import { LoginResponse } from '../login-response.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  serverResponse: any;
  constructor(private backendService: BackendService, public router: Router) {}

  ngOnInit(): void {}

  submit(user: string, password: string) {
    this.backendService.signIn(user, password).subscribe(
      (res: LoginResponse | any) => {
        if (res.id) {
          // Usually you would use the redirect URL from the auth service.
          // However to keep the example simple, we will always redirect to `/admin`.
          let redirectUrl;
          const loggedUserRole = this.backendService
            .getLocalStorageUser()
            .roles[0].toLowerCase();
          if (loggedUserRole.includes('patient')) {
            redirectUrl = '/patient';
          }
          if (loggedUserRole.includes('medic')) {
            redirectUrl = '/medic';
          }
          if (loggedUserRole.includes('reader')) {
            redirectUrl = '/reader';
          }
          if (loggedUserRole.includes('admin')) {
            redirectUrl = '/admin';
          }

          // Redirect the user
          this.router.navigate([redirectUrl]);
        } else {
          // this.serverResponse = res;
          this.serverResponse = res.error;
        }
      },
      (error) => {
        console.error(error);
        this.serverResponse = error;
      }
    );
  }

  forgotPassword(username: string, event: Event) {
    event.preventDefault();
    this.backendService.forgotPassword(username).subscribe(
      (res) => {
        this.serverResponse = res;
      },
      (error) => {
        console.error(error);
        this.serverResponse = error;
      }
    );
  }
}
