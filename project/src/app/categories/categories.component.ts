import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '../services/categories.service';
import { Categorie } from './categories.model';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  providers: [CategoriesService]
})
export class CategoriesComponent implements OnInit {
  private categories: Categorie[];
  private error: any;
  resultadoBuscaPorId: any;
  editCategorie: Categorie;

  constructor(
    private categoriesService: CategoriesService
  ) { }

  ngOnInit() {
    this.showCategories();
  }

  showCategories(): void {
    this.categoriesService.getCategories()
      .subscribe(
        categories => this.categories = categories,
        error => this.error = error
      );
  }

  findCategories(id: number): void {
    this.editCategorie = undefined;
    if (id) {
      this.categoriesService.getCategoriesById(id)
        .subscribe(
          categorie => this.resultadoBuscaPorId = categorie,
          error => this.resultadoBuscaPorId = 'Categoria não encontrada'
        );
    }
  }

  addCategorie(name: string): void {
    this.editCategorie = undefined;
    name = name.trim();
    if(!name) { return; }

    const newCategorie: Categorie = { name } as Categorie;

    this.categoriesService.addCategories(newCategorie)
      .subscribe(
        categorie => this.categories.push(categorie)
      );
  }

  edit(categorie: Categorie): void {
    this.editCategorie = categorie;
  }

  update(): void {
    if(this.editCategorie) {
      this.categoriesService.updateCategories(this.editCategorie)
        .subscribe(categorie => {
          const x = categorie ? this.categories.findIndex(c => c.id === categorie.id) : -1;
          if (x > -1) { this.categories[x] = categorie }
        });
    }
  }

  removeCategorie(categorie: Categorie): void {
    this.categories = this.categories.filter(c => c !== categorie);

    this.categoriesService.deleteCategories(categorie.id).subscribe();
  }

}
