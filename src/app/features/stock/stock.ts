import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';

import { Item } from '../../core/item/item.interface';
import { ItemService } from '../../core/item/item-service';
import { Options } from './options/options';
import { StatusLabelPipe } from '../../shared/pipes/status.pipe.ts';

@Component({
  selector: 'app-stock',
  standalone: true,
  imports: [
    TableModule,
    DatePipe,
    Options,
    FormsModule,
    DialogModule,
    InputTextModule,
    InputNumberModule,
    ButtonModule,
    ConfirmDialogModule,
    StatusLabelPipe,
  ],
  providers: [ConfirmationService],
  templateUrl: './stock.html',
  styleUrl: './stock.css',
})
export class Stock implements OnInit {
  route = inject(ActivatedRoute);
  itemService = inject(ItemService);
  confirmationService = inject(ConfirmationService);

  items = signal<Item[]>([]);
  categoryId = signal<string>('');

  mode = signal<'none' | 'edit' | 'delete'>('none');
  dialogVisible = signal(false);
  editableItems = signal<Item[]>([]);

  newItem = signal<Omit<Item, 'id'>>({
    name: '',
    status: 1,
    nextCheck: undefined,
    expiring: undefined,
    categoryId: '',
    quantity: 0,
    minQuantity: 1,
  });

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.categoryId.set(params['category']);
      this.loadItems();
    });
  }

  loadItems() {
    this.itemService.getByCategory(this.categoryId()).subscribe((data) => {
      const normalized = data.map((item) => ({
        ...item,
        status: this.computeStatus(item),
      }));
      this.items.set(normalized);
    });
  }

  computeStatus(item: Pick<Item, 'quantity' | 'minQuantity'>): number {
    return item.quantity < item.minQuantity ? 0 : 1;
  }

  handleAdd() {
    this.mode.set('none');
    this.newItem.set({
      name: '',
      status: 1,
      nextCheck: undefined,
      expiring: undefined,
      categoryId: this.categoryId(),
      quantity: 0,
      minQuantity: 1,
    });
    this.dialogVisible.set(true);
  }

  saveNewItem() {
    const itemToSave: Omit<Item, 'id'> = {
      ...this.newItem(),
      categoryId: this.categoryId(),
      status: this.computeStatus(this.newItem()),
    };

    this.itemService.add(itemToSave).subscribe((created) => {
      this.items.update((current) => [...current, created]);
      this.dialogVisible.set(false);
    });
  }

  handleEdit() {
    if (this.mode() === 'edit') {
      this.saveEdit();
      return;
    }

    this.mode.set('edit');
    this.editableItems.set(this.items().map((item) => ({ ...item })));
  }

  saveEdit() {
    const updatedItems = this.editableItems().map((item) => ({
      ...item,
      status: this.computeStatus(item),
    }));

    updatedItems.forEach((item) => {
      this.itemService.update(item).subscribe();
    });

    this.items.set(updatedItems);
    this.editableItems.set([]);
    this.mode.set('none');
  }

  cancelEdit() {
    this.editableItems.set([]);
    this.mode.set('none');
  }

  handleDelete() {
    this.mode.set(this.mode() === 'delete' ? 'none' : 'delete');
  }

  confirmDelete(item: Item) {
    this.confirmationService.confirm({
      header: 'Conferma eliminazione',
      message: `Vuoi eliminare "${item.name}"?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Elimina',
      rejectLabel: 'Annulla',
      accept: () => {
        this.itemService.delete(item.id).subscribe(() => {
          this.items.update((current) => current.filter((i) => i.id !== item.id));
        });
      },
    });
  }
}
