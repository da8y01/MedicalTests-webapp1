import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BackendService } from '../backend.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  constructor(public backendService: BackendService, public router: Router) {}

  ngOnInit(): void {
    console.log(this.backendService.loggedUser)
  }

  logout() {
    this.backendService.logout();
    this.router.navigate(['/login']);
  }
}
