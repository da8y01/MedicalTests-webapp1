import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { Result } from './result.model';

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  // private resultsUrl = 'api/results'
  private resultsUrl = 'http://localhost:3000/api/results'

  constructor(private http: HttpClient) { }

  getResults(): Observable<Result[]> {
    return this.http.get<Result[]>(this.resultsUrl)
      .pipe(
        tap(_ => console.info('fetched results', _)),
        catchError(this.handleError<Result[]>('getResults', []))
      );
  }

  getResult(id: number): Observable<Result> {
    const url = `${this.resultsUrl}/${id}`;
    return this.http.get<Result>(url).pipe(
      tap(_ => console.info(`fetched result id=${id}`)),
      catchError(this.handleError<Result>(`getResult id=${id}`))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error)
      return of(result as T)
    }
  }
}
