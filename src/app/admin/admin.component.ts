import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BackendService } from '../backend.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit {
  patientsLength: number = 0;
  medicsLength: number = 0;
  termPatient: string = '';
  termMedic: string = '';
  deletePatients: number[] = [];
  deleteMedics: number[] = [];

  constructor(private backendService: BackendService, private router: Router) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
  }

  ngOnInit(): void {}

  countPatients(event: number): number {
    this.patientsLength = event;
    return this.patientsLength;
  }
  countMedics(event: number): number {
    this.medicsLength = event;
    return this.medicsLength;
  }

  searchPatient(term: string): void {
    this.termPatient = term;
  }
  searchMedic(term: string): void {
    this.termMedic = term;
  }

  updateDeleteListPatients(deleteList: number[]) {
    this.deletePatients = deleteList;
  }
  updateDeleteListMedics(deleteList: number[]) {
    this.deleteMedics = deleteList;
  }

  deleteSelected(type: string) {
    this.backendService
      .deleteUsers(type === 'patient' ? this.deletePatients : this.deleteMedics)
      .subscribe(
        (count) => {
          this.router.navigate(['/admin']);
        },
        (error) => {
          console.error(error);
        }
      );
  }
}
