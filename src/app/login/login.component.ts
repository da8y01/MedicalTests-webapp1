import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BackendService } from '../backend.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor(private backendService: BackendService, public router: Router) {}

  ngOnInit(): void {}

  submit(user: string, password: string) {
    this.backendService
      .signIn(user, password)
      // .login()
      .subscribe((res) => {
        console.log(res);
        // this.message = this.getMessage();
        if (this.backendService.isLoggedIn) {
          // Usually you would use the redirect URL from the auth service.
          // However to keep the example simple, we will always redirect to `/admin`.
          // const redirectUrl = '/medic';
          // const redirectUrl = '/patient';
          const redirectUrl = this.backendService.loggedUser.roles[0].toLowerCase().includes('medic') ? '/medic' : '/patient';

          // Redirect the user
          this.router.navigate([redirectUrl]);
        }
      });
  }
}
