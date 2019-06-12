import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Item } from '../shared/item.model';
import { Lista } from '../shared/lista.model';
import { Categorie } from '../categories/categories.model';
import { ItemService } from '../services/item.service';
import { CategoriesService } from '../services/categories.service';
import { ListaService } from '../services/lista.service';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  providers: [ItemService, CategoriesService, ListaService]
})
export class ItemsComponent implements OnInit {
  itens: Item[];
  categories: Categorie[];
  listas: Lista[]
  itemEdit: Item;
  loader = false;
  loaderGetId = false;
  loaderPost = false;
  loaderPut = false;
  loaderDelete = false;
  idCategoria: any;
  idLista: any;

  constructor(
    private itemService: ItemService,
    private categorieService: CategoriesService,
    private listaService: ListaService,
    private route: ActivatedRoute,
    private location: Location
  ) {
    this.idCategoria = +this.route.snapshot.paramMap.get('idCategoria');
    this.idLista = +this.route.snapshot.paramMap.get('idLista');
   }

  ngOnInit() {
    this.getItem();
  }

  goBack(): void {
    this.location.back();
  }

  getItem(): void {
    this.loader = true;
    this.itemService.getItemById(this.idCategoria, this.idLista)
      .subscribe(
        item => this.itens = item,
        (error) => this.itens = error,
        () => this.loader = false
      );

    this.categorieService.getCategoriesById(this.idCategoria)
      .subscribe(
        categorie => this.categories = categorie
      )
    this.listaService.getListasDaCategoriaById(this.idCategoria, this.idLista)
      .subscribe(
        lista => this.listas = lista
      )
  }

  findItem(idItem: number): void {
    this.itemEdit = undefined;
    if (idItem) {
      this.loaderGetId = true;
      this.itemService.getItemListaDaCategoriaId(idItem, this.idCategoria, this.idLista)
        .subscribe(
          item => {
            this.itens = [];
            this.itens.push(item);
          },
          error => {
            this.itens = error;
            this.loaderGetId = false;
          },
          () => this.loaderGetId = false
        );
    }
  }

  addItem(name: string): void {
    this.itemEdit = undefined;
    name = name.trim();
    if(!name) { return; }

    const newItem: Item = { name } as Item;
    this.loaderPost = true;

    this.itemService.createItem(newItem, this.idCategoria, this.idLista)
      .subscribe(
        item => this.itens.push(item),
        (error) => this.itens = error,
        () => this.loaderPost = false
      );
  }

  edit(item: Item): void {
    this.itemEdit = item;
  }

  update(idItem: Item): void {
    if(this.itemEdit) {
      this.loaderPut = true;
      this.itemService.updateItem(this.itemEdit, this.idCategoria, this.idLista)
        .subscribe(item => {
            const x = item ? this.itens.findIndex(c => c.id === item.id) : -1;
            if (x > -1) { this.itens[x] = item }
          },
          (erro) => this.itens = erro,
          () => this.loaderPut = false
        );
      this.itemEdit = undefined;
    }
  }

  removeItem(item: Item): void {
    this.loaderDelete = true;
    this.itens = this.itens.filter(c => c !== item);

    this.itemService.deleteItem(item.id, this.idCategoria, this.idLista).subscribe(
      () => console.log('sucesso'),
      (error) => '',
      () => this.loaderDelete = false
    );
  }
}
