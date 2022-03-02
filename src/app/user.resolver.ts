import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { BackendService } from './backend.service';
import { Patient } from './patient.model';

@Injectable({
  providedIn: 'root',
})
export class UserResolver implements Resolve<Patient> {
  constructor(private backendService: BackendService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Patient> {
    return this.backendService.getUser(
      parseInt(route.paramMap.get('id') || '')
    );
  }
}
