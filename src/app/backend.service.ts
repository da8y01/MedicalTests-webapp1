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
      firstName: '',
      lastName: '',
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
      firstName: '',
      lastName: '',
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

  getPatients(medicId: number): Observable<any> {
    return this.http
      .get<any>(`${environment.apiUrl}/patients/assignedTo/${medicId}`)
      .pipe(
        tap((_) => console.info('fetched patients', _)),
        catchError(
          this.handleError<any>('getPatients', {
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
      map((res) => res),
      catchError(
        this.handleError<PatientResponse>('searchPatients', {
          count: 0,
          rows: [],
        })
      )
    );
  }

  searchUsers(
    term: string,
    queryParams: QueryParams | any
  ): Observable<PatientResponse> {
    const qs = new URLSearchParams(queryParams);
    const requestUrl = `${
      environment.apiUrl
    }/patients?&document=${term.trim()}&${qs.toString()}`;
    return this.http.get<PatientResponse>(requestUrl).pipe(
      tap((x) =>
        x.count
          ? console.info(`found patients matching "${term}"`)
          : console.info(`no patients matching "${term}"`)
      ),
      map((res) => res),
      catchError(
        this.handleError<PatientResponse>('searchUsers', {
          count: 0,
          rows: [],
        })
      )
    );
  }

  getUser(id: number): Observable<Patient> {
    const url = `${environment.apiUrl}/users/${id}`;
    return this.http.get<Patient>(url).pipe(
      tap((_) => console.info(`fetched patient id=${id}`)),
      catchError(this.handleError<Patient>(`getUser id=${id}`))
    );
  }

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

  createPatient(patient: LoginResponse | any): Observable<LoginResponse | any> {
    return this.http
      .post<LoginResponse | any>(`${environment.apiUrl}/auth/signup`, patient)
      .pipe(
        map((res: LoginResponse | any) => {
          return res;
        }),
        catchError(this.handleError('createPatient', {}))
      );
  }

  updatePatient(patient: LoginResponse | any): Observable<LoginResponse | any> {
    return this.http
      .put<LoginResponse | any>(`${environment.apiUrl}/users`, patient)
      .pipe(
        map((res: LoginResponse | any) => {
          console.info('updatePatient', res);
          return res;
        }),
        catchError(this.handleError('updatePatient', {}))
      );
  }

  deleteUsers(patients: string[]): Observable<number> {
    return this.http
      .post<number>(`${environment.apiUrl}/patients/delete`, { patients })
      .pipe(
        map((res: number) => {
          return res;
        }),
        catchError(this.handleError('deletePatients', 0))
      );
  }

  assignPatients(medic: string, patients: string[]): Observable<any> {
    return this.http
      .post<any>(`${environment.apiUrl}/patients/assignMedic`, {
        medic,
        patients,
      })
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(this.handleError('deletePatients', 0))
      );
  }

  forgotPassword(username: string): Observable<string | any> {
    return this.http
      .get<string | any>(
        `${environment.apiUrl}/auth/forgotPassword/${username}`
      )
      .pipe(
        map((res: string | any) => {
          console.info(res);
          return res;
        }),
        catchError(this.handleError('forgotPassword', {}))
      );
  }

  uploadResult(formData: any): Observable<any> {
    return this.http
      .post<any>(`${environment.apiUrl}/results/upload`, formData)
      .pipe(
        map((res: any) => {
          console.info('uploadResult', res);
          return res;
        }),
        catchError(this.handleError('uploadResult', {}))
      );
  }

  uploadResult2(formData: any, patientUsername: string): Promise<any> {
    return this.http
      .post<any>(`${environment.apiUrl}/results/upload/${patientUsername}`, formData)
      .toPromise()
      .then((res) => {
        console.info(res);
        return res;
      })
      .catch((error) => {
        console.error(error);
      });
  }

  uploadReading(formData: FormData, resultId: number): Promise<any> {
    return this.http
      .post<any>(`${environment.apiUrl}/results/uploadReading/${resultId}`, formData)
      .toPromise()
      .then((res) => {
        console.info(res);
        return res;
      })
      .catch((error) => {
        console.error(error);
      });
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      let errorCustom = {};
      errorCustom = { error: 'Fallo en la operación.' };
      if (operation === 'forgotPassword' && error.status === 404) {
        errorCustom = { error: 'Usuario inválido.' };
      }
      if (operation === 'signIn' && error.status === 401) {
        errorCustom = { error: 'Password inválido.' };
      }
      if (operation === 'signIn' && error.status === 404) {
        errorCustom = { error: 'Usuario inválido.' };
      }
      return of(errorCustom as T);
      // return of(errorCustom as unknown as T);
      // return of(result as T);
      // return of(error.message as T);
    };
  }

  getLocalStorageUser(): any {
    const localStorageUser = localStorage.getItem('user') || '{}';
    return JSON.parse(localStorageUser);
  }
}
