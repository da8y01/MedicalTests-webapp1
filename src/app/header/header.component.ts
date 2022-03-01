import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BackendService } from '../backend.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  navTitles = '';
  nameUser = '';
  documentUser = null;
  constructor(public backendService: BackendService, public router: Router) {}

  ngOnInit(): void {
    this.nameUser =
      this.backendService.getLocalStorageUser().firstName +
      ' ' +
      this.backendService.getLocalStorageUser().lastName;
    this.documentUser = this.backendService.getLocalStorageUser().username;
    if (this.router.url.includes('patient')) this.navTitles = 'Resultados';
    if (this.router.url.includes('medic'))
      this.navTitles = 'Pacientes remitidos';
    if (this.router.url.includes('admin')) {
      this.navTitles = 'Administrador';
      this.nameUser = 'Sociedad de Diagnóstico Visual S.A.S.';
      this.documentUser = null;
    }
    if (this.router.url.includes('create-patient')) {
      this.navTitles = 'Nuevo paciente';
      this.nameUser = '';
      this.documentUser = null;
    }
    if (this.router.url.includes('update-patient')) {
      this.navTitles = 'Información del paciente';
      this.nameUser = '';
      this.documentUser = null;
    }
  }

  // logout(event: MouseEvent) {
  //   event.preventDefault();
  //   this.backendService.logout();
  //   this.router.navigate(['/login']);
  // }
}
