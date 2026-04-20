import { Component, inject, signal, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DatePipe } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';
import { Item } from '../../core/item/item.interface';
import { ItemMockService } from '../../core/item/item-mock.service';

@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [TableModule, ButtonModule, DatePipe, SkeletonModule],
  templateUrl: './alerts.html',
  styleUrl: './alerts.css',
})
export class Alerts implements OnInit {
  itemService = inject(ItemMockService);
  criticalItems = signal<Item[]>([]);
  loading = signal(false);

  ngOnInit() {
    this.loading.set(true);

    this.itemService.getCritical().subscribe({
      next: (data) => {
        this.criticalItems.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  onRestock(item: Item) {
    // TODO: implementare quando il backend sarà pronto
  }
}