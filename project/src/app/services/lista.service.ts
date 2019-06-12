import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import { Lista } from '../shared/lista.model';

const httpOptions = {
  headers: new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
    'Acess-Control-Request-Method': 'GET, PUT, POST, DELETE, OPTIONS',
    'Content-Type': 'application/json',
  })
};

@Injectable()
export class ListaService {
  constructor(
    private http: HttpClient
  ) {}

  // getLista(): Observable<Lista[]> {
  //   return this.http.get<Lista[]>(this.listaUrl)
  //     .pipe(
  //       retry(3),
  //       catchError(this.handleError)
  //     );
  // }

  getListaById(id: number): Observable<Lista[]> {
    const url = `/api/categories/${id}/lists/`;
    return this.http.get<Lista[]>(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  createLista(lista: Lista, id: number): Observable<Lista> {
    const url = `/api/categories/${id}/lists/`;
    return this.http.post<Lista>(url, lista, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateLista(lista: Lista, idCategoria: number, idLista: number): Observable<Lista> {
    const url = `/api/categories/${idCategoria}/lists/${idLista}`;
    httpOptions.headers = httpOptions.headers.set('Authorization', 'my-new-auth-token');

    return this.http.put<Lista>(url, lista, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteLista(idLista: number, id: number): Observable<{}> {
    const url = `/api/categories/${id}/lists/${idLista}`;

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
