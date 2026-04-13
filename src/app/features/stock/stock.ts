import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TableModule } from 'primeng/table';
import { Item } from '../../core/item/item.interface';
import { ItemService } from '../../core/item/item-service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-stock',
  standalone: true,
  imports: [TableModule, DatePipe],
  templateUrl: './stock.html',
  styleUrl: './stock.css',
})
export class Stock implements OnInit {
  route = inject(ActivatedRoute);
  itemService = inject(ItemService);
  items = signal<Item[]>([]);
  categoryId = signal<string>('');

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.categoryId.set(params['category']);
      this.itemService.getByCategory(params['category']).subscribe((data) => {
        this.items.set(data);
      });
    });
  }
}
