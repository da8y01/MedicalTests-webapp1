import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BackendService } from '../backend.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  @Input('reader-patient') readerPatient?: {
    nameUser: string;
    documentUser: string;
  } = null;
  navTitles = '';
  nameUser = '';
  documentUser: string = null;

  constructor(public backendService: BackendService, public router: Router) {}

  ngOnInit(): void {
    this.nameUser =
      this.readerPatient?.nameUser ||
      this.backendService.getLocalStorageUser().firstName +
        ' ' +
        this.backendService.getLocalStorageUser().lastName;
    this.documentUser =
      this.readerPatient?.documentUser ||
      this.backendService.getLocalStorageUser().username;
    if (this.router.url.includes('patient')) this.navTitles = 'Resultados';
    if (this.router.url.includes('reader')) this.navTitles = 'Pacientes';
    if (this.router.url.includes('medic'))
      this.navTitles = 'Pacientes remitidos';
    if (this.router.url.includes('update-readings'))
      this.navTitles = 'Exámenes del paciente / Editar lecturas de:';
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
    if (this.router.url.includes('create-medic')) {
      this.navTitles = 'Nuevo remisor';
      this.nameUser = '';
      this.documentUser = null;
    }
    if (this.router.url.includes('update-patient')) {
      this.navTitles = 'Información del paciente';
      this.nameUser = '';
      this.documentUser = null;
    }
    if (this.router.url.includes('update-medic')) {
      this.navTitles = 'Información del remisor';
      this.nameUser = '';
      this.documentUser = null;
    }
  }

  showRegresar = () =>
    this.router.url.includes('create-patient') ||
    this.router.url.includes('create-medic') ||
    this.router.url.includes('update-patient') ||
    this.router.url.includes('update-medic');
}
