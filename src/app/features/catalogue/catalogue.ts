import { Component, inject, signal, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { SkeletonModule } from 'primeng/skeleton';
import { Item } from '../../core/item/item.interface';
import { CategoryMockService } from '../../core/category/category-mock.service';
import { StatusLabelPipe } from '../../shared/pipes/status.pipe.ts';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { Category } from '../../core/category/category.interface';
import { ITEM_SERVICE_TOKEN } from '../../core/item/item-service.token';
import { Options } from '../stock/options/options';

@Component({
  selector: 'app-catalogue',
  standalone: true,
  imports: [
    TableModule,
    SkeletonModule,
    StatusLabelPipe,
    FormsModule,
    InputTextModule,
    IconField,
    InputIcon,
    DialogModule,
    InputNumberModule,
    SelectModule,
    ButtonModule,
    ConfirmDialogModule,
    Options,
  ],
  providers: [ConfirmationService],
  templateUrl: './catalogue.html',
  styleUrl: './catalogue.css',
})
export class Catalogue implements OnInit {
  itemService = inject(ITEM_SERVICE_TOKEN);
  categoryService = inject(CategoryMockService);
  confirmationService = inject(ConfirmationService);

  items = signal<Item[]>([]);
  editableItems = signal<any[]>([]);
  categories = signal<Category[]>([]);
  loading = signal(false);
  dialogVisible = signal(false);
  mode = signal<'none' | 'edit' | 'delete'>('none');

  newItem = signal<Omit<Item, 'id' | 'status' | 'nextCheck' | 'expiring' | 'quantity'>>({
    name: '',
    categoryId: '',
    minQuantity: 1,
  });

  speedDialItems: MenuItem[] = [
    {
      icon: 'pi pi-trash',
      command: () => this.mode.set(this.mode() === 'delete' ? 'none' : 'delete'),
    },
    {
      icon: 'pi pi-pencil',
      command: () => {
        if (this.mode() === 'edit') {
          this.saveEdit();
        } else {
          this.mode.set('edit');
          this.editableItems.set(
            this.items().map((i) => ({
              ...i,
              categoryId: i.categoryId,
            })),
          );
        }
      },
    },
    {
      icon: 'pi pi-plus',
      command: () => {
        this.mode.set('none');
        this.newItem.set({ name: '', categoryId: '', minQuantity: 1 });
        this.dialogVisible.set(true);
      },
    },
  ];

  ngOnInit() {
    this.loading.set(true);

    this.itemService.getAll().subscribe({
      next: (data) => {
        this.items.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });

    this.categoryService.getCategories().subscribe((data) => {
      this.categories.set(data);
    });
  }

  getCategoryName(categoryId: string): string {
    return this.categoryService.getCategoryName(categoryId);
  }

  saveNewItem() {
    const itemToSave: Omit<Item, 'id'> = {
      name: this.newItem().name,
      categoryId: String(this.newItem().categoryId),
      minQuantity: this.newItem().minQuantity,
      quantity: 0,
      status: 0,
    };

    this.itemService.add(itemToSave).subscribe((created) => {
      this.items.update((current) => [...current, created]);
      this.dialogVisible.set(false);
    });
  }

  saveEdit() {
    const updatedItems: Item[] = this.editableItems().map((i: Item) => ({
      ...i,
      categoryId: i.categoryId.toString(),
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

  confirmDelete(item: Item) {
    this.confirmationService.confirm({
      header: 'Confirm Deletion',
      message: `Are you sure you want to delete "${item.name}"?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Delete',
      rejectLabel: 'Cancel',
      accept: () => {
        this.itemService.deleteCatalogueItem(item.id).subscribe(() => {
          this.items.update((current) => current.filter((i) => i.id !== item.id));
        });
      },
    });
  }

  handleEdit() {
    if (this.mode() === 'edit') {
      this.saveEdit();
      return;
    }
    this.mode.set('edit');
    this.editableItems.set(
      this.items().map((i) => ({
        ...i,
        categoryId: Number(i.categoryId),
      })),
    );
  }
}
