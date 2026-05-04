import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { forkJoin } from 'rxjs';

import { CardModule } from 'primeng/card';

import { CATEGORY_SERVICE_TOKEN } from '../../core/category/category-service.token';
import { ITEM_SERVICE_TOKEN } from '../../core/item/item-service.token';
import { Category } from '../../core/category/category.interface';
import { Item } from '../../core/item/item.interface';
import { Router } from '@angular/router';
import { ChartModule } from 'primeng/chart';
import { ProgressBarModule } from 'primeng/progressbar';
import { TagModule } from 'primeng/tag';
import { Skeleton } from 'primeng/skeleton';

type StockStatus = 'ok' | 'low' | 'critical';

interface CategoryStockRow {
  id: number | string;
  name: string;
  totalQuantity: number;
  minQuantity: number;
  percentage: number;
  status: StockStatus;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CardModule, ChartModule, ProgressBarModule, TagModule, Skeleton],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private itemService = inject(ITEM_SERVICE_TOKEN);
  private categoryService = inject(CATEGORY_SERVICE_TOKEN);
  private router = inject(Router);

  loading = signal(true);

  stockItems = signal<Item[]>([]);
  categories = signal<Category[]>([]);

  totalItems = computed(() => this.stockItems().length);

  totalQuantity = computed(() => this.stockItems().reduce((sum, item) => sum + item.quantity, 0));

  critical = computed(() => this.stockItems().filter((item) => item.quantity === 0).length);

  low = computed(
    () =>
      this.stockItems().filter((item) => item.quantity > 0 && item.quantity < item.minQuantity)
        .length,
  );

  itemsNeedingAttention = computed(() => this.critical());

  goToAlerts(): void {
    this.router.navigate(['/alerts']);
  }

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    forkJoin({
      categories: this.categoryService.getCategories(),
      stockItems: this.itemService.getStock(),
    }).subscribe({
      next: ({ categories, stockItems }) => {
        this.categories.set(categories);
        this.stockItems.set(stockItems);

        this.loading.set(false);
      },
      error: (err) => {
        console.error('Dashboard error:', err);
        this.loading.set(false);
      },
    });
  }

  donutChartData = computed(() => ({
    labels: ['In stock', 'Low stock', 'Out of stock'],
    datasets: [
      {
        data: [this.totalItems() - this.low() - this.critical(), this.low(), this.critical()],
        backgroundColor: ['#22c55e', '#facc15', '#ef4444'],
        borderWidth: 0,
        hoverOffset: 16,
      },
    ],
  }));

  donutChartOptions = {
    cutout: '68%',
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  categoryRows = computed<CategoryStockRow[]>(() =>
    this.categories().map((category) => {
      const items = this.stockItems().filter(
        (item) => String(item.categoryId) === String(category.id),
      );

      const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
      const minQuantity = items.reduce((sum, item) => sum + item.minQuantity, 0);

      const percentage =
        minQuantity === 0 ? 100 : Math.min(Math.round((totalQuantity / minQuantity) * 100), 100);

      return {
        id: category.id,
        name: category.name,
        totalQuantity,
        minQuantity,
        percentage,
        status: this.getStatus(totalQuantity, minQuantity),
      };
    }),
  );

  private getStatus(quantity: number, minQuantity: number): StockStatus {
    if (quantity === 0) return 'critical';
    if (quantity < minQuantity) return 'low';
    return 'ok';
  }

  getStatusLabel(status: StockStatus): string {
    if (status === 'critical') return 'Critical';
    if (status === 'low') return 'Low stock';
    return 'OK';
  }

  getStatusSeverity(status: StockStatus): 'success' | 'warn' | 'danger' {
    if (status === 'critical') return 'danger';
    if (status === 'low') return 'warn';
    return 'success';
  }
}
