import { Component, inject, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Category } from '../../core/category/category.interface';
import { CategoryMockService } from '../../core/category/category-mock.service';
import { Router } from '@angular/router';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CATEGORY_SERVICE_TOKEN } from '../../core/category/category-service.token';

@Component({
  selector: 'app-categories',
  imports: [ButtonModule, ProgressSpinnerModule],
  templateUrl: './categories.html',
  styleUrl: './categories.css',
})
export class Categories {
  categories = signal<Category[]>([]);
  catService = inject(CATEGORY_SERVICE_TOKEN);
  router = inject(Router);

  loading = signal(false);

  ngOnInit() {
    this.loading.set(true);

    this.catService.getCategories().subscribe({
      next: (data) => {
        this.categories.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  onSelectCategory(cat: Category) {
    console.log(`Navigazione verso categoria: ${cat.name}`);
    this.router.navigate(['/categories/stock', cat.id]);
  }
}
