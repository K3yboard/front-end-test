import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import { Item } from '../shared/item.model';

const httpOptions = {
  headers: new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
    'Acess-Control-Request-Method': 'GET, PUT, POST, DELETE, OPTIONS',
    'Content-Type': 'application/json',
  })
};

@Injectable()
export class ItemService {
  constructor(
    private http: HttpClient
  ) {}

  getItemById(idCategoria: number, idLista: number): Observable<Item[]> {
    const url = `/api/categories/${idCategoria}/lists/${idLista}/items`;
    return this.http.get<Item[]>(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  getItemListaDaCategoriaId(
    idItem: number, idCategoria: number, idLista: number): Observable<Item[]> {
    const url = `/api/categories/${idCategoria}/lists/${idLista}/items/${idItem}`;
    return this.http.get<Item[]>(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  createItem(item: Item, idCategoria: number, idLista: number): Observable<Item> {
    const url = `/api/categories/${idCategoria}/lists/${idLista}/items`;
    return this.http.post<Item>(url, item, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateItem(item: Item, idCategoria: number, idLista: number): Observable<Item> {
    const url = `/api/categories/${idCategoria}/lists/${idLista}/items/${item.id}`;
    httpOptions.headers = httpOptions.headers.set('Authorization', 'my-new-auth-token');

    return this.http.put<Item>(url, item, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteItem(idItem: number, idCategoria: number, idLista: number): Observable<{}> {
    const url = `/api/categories/${idCategoria}/lists/${idLista}/items/${idItem}`;

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
