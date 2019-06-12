import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ListaService } from '../services/lista.service';

import { Lista } from '../shared/lista.model';
import { Categorie } from '../categories/categories.model';
import { CategoriesService } from '../services/categories.service';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  providers: [ListaService, CategoriesService]
})
export class ListsComponent implements OnInit {
  listas: Lista[];
  categories: Categorie[];
  listaEdit: Lista;
  loader = false;
  loaderGetId = false;
  loaderPost = false;
  loaderPut = false;
  loaderDelete = false;
  idCategoria: any;

  constructor(
    private listaService: ListaService,
    private categorieService: CategoriesService,
    private route: ActivatedRoute,
    private location: Location
  ) {
    this.idCategoria = +this.route.snapshot.paramMap.get('idCategoria');
   }

  ngOnInit() {
    this.getLista();
  }

  goBack(): void {
    this.location.back();
  }

  getLista(): void {
    this.loader = true;
    this.listaService.getListaById(this.idCategoria)
      .subscribe(
        lista => this.listas = lista,
        (error) => this.listas = error,
        () => this.loader = false
      );

      this.categorieService.getCategoriesById(this.idCategoria)
        .subscribe(
          categorie => this.categories = categorie
        )
  }

  findLista(idLista: number): void {
    this.listaEdit = undefined;
    if (idLista) {
      this.loaderGetId = true;
      this.listaService.getListasDaCategoriaById(this.idCategoria, idLista)
        .subscribe(
          lista => {
            this.listas = [];
            this.listas.push(lista);
          },
          error => {
            this.listas = error;
            this.loaderGetId = false;
          },
          () => this.loaderGetId = false
        );
    }
  }

  addLista(name: string): void {
    this.listaEdit = undefined;
    name = name.trim();
    if(!name) { return; }

    const newLista: Lista = { name } as Lista;
    this.loaderPost = true;

    this.listaService.createLista(newLista, this.idCategoria)
      .subscribe(
        lista => this.listas.push(lista),
        (error) => this.listas = error,
        () => this.loaderPost = false
      );
  }

  edit(lista: Lista): void {
    this.listaEdit = lista;
  }

  update(idLista: Lista): void {
    if(this.listaEdit) {
      this.loaderPut = true;
      this.listaService.updateLista(this.listaEdit, this.idCategoria, idLista.id)
        .subscribe(lista => {
            const x = lista ? this.listas.findIndex(c => c.id === lista.id) : -1;
            if (x > -1) { this.listas[x] = lista }
          },
          (erro) => this.listas = erro,
          () => this.loaderPut = false
        );
      this.listaEdit = undefined;
    }
  }

  removeLista(lista: Lista): void {
    this.loaderDelete = true;
    this.listas = this.listas.filter(c => c !== lista);

    this.listaService.deleteLista(lista.id, this.idCategoria).subscribe(
      () => console.log('sucesso'),
      (error) => '',
      () => this.loaderDelete = false
    );
  }
}
