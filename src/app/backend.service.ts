import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { Result } from './result.model';
import { environment } from '../environments/environment';
import { Patient } from './patient.model';

@Injectable({
  providedIn: 'root',
})
export class BackendService {
  constructor(private http: HttpClient) {}

  getResults(): Observable<Result[]> {
    return this.http.get<Result[]>(`${environment.apiUrl}/results`).pipe(
      tap((_) => console.info('fetched results', _)),
      catchError(this.handleError<Result[]>('getResults', []))
    );
  }

  getResult(id: number): Observable<Result> {
    const url = `${environment.apiUrl}/results/${id}`;
    return this.http.get<Result>(url).pipe(
      tap((_) => console.info(`fetched result id=${id}`)),
      catchError(this.handleError<Result>(`getResult id=${id}`))
    );
  }

  getPatients(): Observable<Patient[]> {
    return this.http.get<Patient[]>(`${environment.apiUrl}/patients`).pipe(
      tap((_) => console.info('fetched patients', _)),
      catchError(this.handleError<Patient[]>('getPatients', []))
    );
  }

  getPatient(id: number): Observable<Patient> {
    const url = `${environment.apiUrl}/patients/${id}`;
    return this.http.get<Patient>(url).pipe(
      tap((_) => console.info(`fetched patient id=${id}`)),
      catchError(this.handleError<Patient>(`getPatient id=${id}`))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }
}
