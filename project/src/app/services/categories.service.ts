import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import { URL_API } from '../app.api';
import { Categorie } from '../categories/categories.model';

@Injectable()
export class CategoriesService {
  url = URL_API + '/categories';

  constructor(
    private http: HttpClient
  ) {}

  getCategories(): Observable<Categorie[]> {
    return this.http.get<Categorie[]>(this.url)
      .pipe(
        retry(3),
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
