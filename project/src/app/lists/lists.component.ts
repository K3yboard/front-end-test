import { Component, OnInit } from '@angular/core';
import { ListaService } from '../services/lista.service';
import { Lista } from '../shared/lista.model';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  providers: [ListaService]
})
export class ListsComponent implements OnInit {
  listas: Lista[];
  listaEdit: Lista;
  loader = false;
  loaderGetId = false;
  loaderPost = false;
  loaderPut = false;
  loaderDelete = false;

  constructor(
    private listaService: ListaService
  ) { }

  ngOnInit() {
    this.getLista();
  }

  getLista(): void {
    this.loader = true;
    this.listaService.getLista()
      .subscribe(
        lista => this.listas = lista,
        (error) => this.listas = error,
        () => this.loader = false
      );
  }

  findLista(id: number): void {
    this.listaEdit = undefined;
    if (id) {
      this.loaderGetId = true;
      this.listaService.getListaById(id)
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

    this.listaService.createLista(newLista)
      .subscribe(
        lista => this.listas.push(lista),
        (error) => this.listas = error,
        () => this.loaderPost = false
      );
  }

  edit(lista: Lista): void {
    this.listaEdit = lista;
  }

  update(): void {
    if(this.listaEdit) {
      this.loaderPut = true;
      this.listaService.updateLista(this.listaEdit)
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

    this.listaService.deleteLista(lista.id).subscribe(
      () => console.log('sucesso'),
      (error) => '',
      () => this.loaderDelete = false
    );
  }
}
