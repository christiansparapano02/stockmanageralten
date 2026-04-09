import { Component, inject, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Category } from '../../core/category/category.interface';
import { CategoryService } from '../../core/category/category-service';

@Component({
  selector: 'app-categories',
  imports: [ButtonModule],
  templateUrl: './categories.html',
  styleUrl: './categories.css',
})
export class Categories {
  categories = signal<Category[]>([]);
  catService = inject(CategoryService);

  ngOnInit() {
    this.catService.getCategories().subscribe((data) => {
      this.categories.set(data);
    });
  }

  onSelectCategory(cat: Category) {
    console.log(`Navigazione verso categoria: ${cat.name}`);
    //aggiungere router.navigate([])
  }
}
