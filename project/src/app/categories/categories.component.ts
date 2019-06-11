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

  constructor(
    private categoriesService: CategoriesService
  ) { }

  ngOnInit() {
    // this.showCategories();
  }

  showCategories(): void {
    this.categoriesService.getCategories()
      .subscribe(
        categories => this.categories = categories,
        error => this.error = error
      );
  }

  addCategorie(name: string): void {
    name = name.trim();
    if(!name) { return; }

    const newCategorie: Categorie = { name } as Categorie;

    this.categoriesService.addCategories(newCategorie)
      .subscribe(categorie => this.categories.push(categorie));
  }

}
