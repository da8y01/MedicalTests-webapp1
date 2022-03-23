import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  deletePatients: string[] = [];
  deleteMedics: string[] = [];
  urlId: number = 0;

  constructor(
    private backendService: BackendService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.urlId = params['id'];
    });
  }

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

  updateDeleteListPatients(deleteList: string[]) {
    this.deletePatients = deleteList;
  }
  updateDeleteListMedics(deleteList: string[]) {
    this.deleteMedics = deleteList;
  }

  deleteSelected(type: string, event: Event) {
    event.preventDefault()
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

  updatePatient(event: Event) {
    event.preventDefault()
    if (this.deletePatients.length === 1) {
      this.router.navigate(['/', 'update-patient', this.deletePatients[0]]);
    } else {
      alert('ERROR: Solamente puede editar un paciente a la vez.');
    }
  }

  updateMedic(event: Event) {
    event.preventDefault()
    if (this.deleteMedics.length === 1) {
      this.router.navigate(['/', 'update-medic', this.deleteMedics[0]]);
    } else {
      alert('ERROR: Solamente puede editar un médico a la vez.');
    }
  }
}
