import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BackendService } from '../backend.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css'],
})
export class LogoutComponent implements OnInit {
  constructor(private backendService: BackendService, private router: Router) {}

  ngOnInit(): void {
    this.backendService.logout();
    this.router.navigate(['/login']);
  }
}
