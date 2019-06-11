import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import { Categorie } from '../categories/categories.model';

const httpOptions = {
  headers: new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
    'Acess-Control-Request-Method': 'GET, PUT, POST, DELETE, OPTIONS',
    'Content-Type': 'application/json',
  })
};

@Injectable()
export class CategoriesService {
  categoriesUrl = '/api/categories';

  constructor(
    private http: HttpClient
  ) {}

  getCategories(): Observable<Categorie[]> {
    return this.http.get<Categorie[]>(this.categoriesUrl)
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  getCategoriesById(id: number): Observable<Categorie[]> {
    const url = `${this.categoriesUrl}/${id}`;
    return this.http.get<Categorie[]>(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  addCategories(categorie: Categorie): Observable<Categorie> {
    return this.http.post<Categorie>(this.categoriesUrl, categorie, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteCategories(id: number): Observable<{}> {
    const url = `${this.categoriesUrl}/${id}`;

    return this.http.delete(url, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('Ocorreu algum erro na rede ou no cliente: ', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    return throwError('Aconteceu algum erro, por favor tente novamente mais tarde');
  };
}
