import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap, delay } from 'rxjs/operators';

import { Result } from './result.model';
import { environment } from '../environments/environment';
import { Patient } from './patient.model';
import { ResultResponse } from './result-response.model';
import { QueryParams } from './query-params.model';
import { PatientResponse } from './patient-response.model';
import { LoginResponse } from './login-response.model';
import { GenericResponse } from './generic-response.model';

@Injectable({
  providedIn: 'root',
})
export class BackendService {
  isLoggedIn: boolean = false;
  loggedUser: LoginResponse;

  // store the URL so we can redirect after logging in
  redirectUrl: string | null = null;

  login(): Observable<boolean> {
    return of(true).pipe(
      delay(1000),
      tap(() => (this.isLoggedIn = true))
    );
  }

  logout(): void {
    this.isLoggedIn = false;
    this.loggedUser = {
      id: 0,
      username: '',
      email: '',
      roles: [],
      accessToken: '',
    };
    localStorage.removeItem('user');
  }

  constructor(private http: HttpClient) {
    this.loggedUser = {
      id: 0,
      username: '',
      email: '',
      roles: [],
      accessToken: '',
    };
  }

  getResults(queryParams: QueryParams): Observable<ResultResponse> {
    const requestUrl = `${environment.apiUrl}/results?limit=${
      queryParams.limit || 10
    }&offset=${queryParams.offset || 0}&patient=${queryParams.patient || 0}`;
    return this.http.get<ResultResponse>(requestUrl).pipe(
      tap((_) => console.info('fetched results', _)),
      catchError(
        this.handleError<ResultResponse>('getResults', { count: 0, rows: [] })
      )
    );
  }

  getResult(id: number): Observable<Result> {
    const url = `${environment.apiUrl}/results/${id}`;
    return this.http.get<Result>(url).pipe(
      tap((_) => console.info(`fetched result id=${id}`)),
      catchError(this.handleError<Result>(`getResult id=${id}`))
    );
  }

  getPatients(): Observable<PatientResponse> {
    return this.http
      .get<PatientResponse>(`${environment.apiUrl}/patients`)
      .pipe(
        tap((_) => console.info('fetched patients', _)),
        catchError(
          this.handleError<PatientResponse>('getPatients', {
            count: 0,
            rows: [],
          })
        )
      );
  }

  /* GET patients whose document contains search term */
  searchPatients(
    term: string,
    queryParams: QueryParams
  ): Observable<PatientResponse> {
    const requestUrl = `${environment.apiUrl}/patients?limit=${
      queryParams.limit || 10
    }&offset=${queryParams.offset || 0}&document=${term.trim()}&medic=${
      this.getLocalStorageUser().id
    }`;
    return this.http.get<PatientResponse>(requestUrl).pipe(
      tap((x) =>
        x.count
          ? console.info(`found patients matching "${term}"`)
          : console.info(`no patients matching "${term}"`)
      ),
      map((res) => (res)),
      catchError(
        this.handleError<PatientResponse>('searchPatients', {
          count: 0,
          rows: [],
        })
      )
    );
  }

  getPatient(id: number): Observable<Patient> {
    const url = `${environment.apiUrl}/patients/${id}`;
    return this.http.get<Patient>(url).pipe(
      tap((_) => console.info(`fetched patient id=${id}`)),
      catchError(this.handleError<Patient>(`getPatient id=${id}`))
    );
  }

  /** POST: sign up a new user to the database */
  signIn(username: string, password: string): Observable<LoginResponse | any> {
    return this.http
      .post<LoginResponse>(`${environment.apiUrl}/auth/signin`, {
        username,
        password,
      })
      .pipe(
        tap(() => (this.isLoggedIn = true)),
        map((res: LoginResponse) => {
          if (res.id) {
            this.isLoggedIn = !!res.id;
            this.loggedUser = res;
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('user', JSON.stringify(this.loggedUser));
          }
          return res;
        }),
        catchError(this.handleError('signIn', {}))
      );
  }

  forgotPassword(username: string): Observable<string | any> {
    return this.http
      .get<string | any>(`${environment.apiUrl}/auth/forgotPassword/${username}`)
      .pipe(
        map((res: string | any) => {
          console.info(res)
          return res;
        }),
        catchError(this.handleError('forgotPassword', {}))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(error.message as T);
    };
  }

  getLocalStorageUser(): any {
    const localStorageUser = localStorage.getItem('user') || '{}';
    return JSON.parse(localStorageUser);
  }
}
