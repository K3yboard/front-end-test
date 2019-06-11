import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '../services/categories.service';
import { Categorie } from './categories.model';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  providers: [CategoriesService]
})
export class CategoriesComponent implements OnInit {
  categories: Categorie[];
  error: any;
  resultadoBuscaPorId: any;
  editCategorie: Categorie;
  loader = false;
  loaderGetId = false;
  loaderPost = false;
  loaderPut = false;
  loaderDelete = false;

  constructor(
    private categoriesService: CategoriesService
  ) { }

  ngOnInit() {
    this.showCategories();
  }

  showCategories(): void {
    this.loader = true;
    this.categoriesService.getCategories()
      .subscribe(
        categories => this.categories = categories,
        error => this.error = error,
        () => this.loader = false
      );
  }

  findCategories(id: number): void {
    this.editCategorie = undefined;
    if (id) {
      this.loaderGetId = true;
      this.categoriesService.getCategoriesById(id)
        .subscribe(
          categorie => this.resultadoBuscaPorId = categorie,
          error => this.resultadoBuscaPorId = 'Categoria não encontrada',
          () => this.loaderGetId = false
        );
    }
  }

  addCategorie(name: string): void {
    this.editCategorie = undefined;
    name = name.trim();
    if(!name) { return; }

    const newCategorie: Categorie = { name } as Categorie;
    this.loaderPost = true;

    this.categoriesService.addCategories(newCategorie)
      .subscribe(
        categorie => this.categories.push(categorie),
        (error) => this.categories = error,
        () => this.loaderPost = false
      );
  }

  edit(categorie: Categorie): void {
    this.editCategorie = categorie;
  }

  update(): void {
    if(this.editCategorie) {
      this.loaderPut = true;
      this.categoriesService.updateCategories(this.editCategorie)
        .subscribe(categorie => {
            const x = categorie ? this.categories.findIndex(c => c.id === categorie.id) : -1;
            if (x > -1) { this.categories[x] = categorie }
          },
          (erro) => this.categories = erro,
          () => this.loaderPut = false
        );
      this.editCategorie = undefined;
    }
  }

  removeCategorie(categorie: Categorie): void {
    this.loaderDelete = true;
    this.categories = this.categories.filter(c => c !== categorie);

    this.categoriesService.deleteCategories(categorie.id).subscribe(
      () => console.log('sucesso'),
      (error) => '',
      () => this.loaderDelete = false
    );
  }

}
