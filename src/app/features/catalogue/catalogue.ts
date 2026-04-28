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
import { ConfirmationService } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { Category } from '../../core/category/category.interface';
import { ITEM_SERVICE_TOKEN } from '../../core/item/item-service.token';

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
    MenuModule,
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
  categories = signal<Category[]>([]);
  loading = signal(false);
  dialogVisible = signal(false);
  editDialogVisible = signal(false);

  selectedItem = signal<Item | null>(null);
  editableItem = signal<any>(null);
  visible = false;

  newItem = signal<Omit<Item, 'id' | 'status' | 'nextCheck' | 'expiring' | 'quantity'>>({
    name: '',
    categoryId: '',
    minQuantity: 1,
  });

  popUpItems = [
    {
      label: 'Options',
      items: [
        {
          label: 'Details',
          icon: 'pi pi-info-circle',
          command: () => this.showDialog(this.selectedItem()!),
        },
        {
          label: 'Edit',
          icon: 'pi pi-pencil',
          command: () => {
            const item = this.selectedItem();

            if (item) {
              this.startEdit(item);
            }
          },
        },
        {
          label: 'Delete',
          icon: 'pi pi-trash',
          command: () => this.confirmDelete(this.selectedItem()!),
        },
      ],
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

  openMenu(event: Event, item: Item) {
    this.selectedItem.set(item);
  }

  showDialog(item: Item) {
    this.itemService.getByCategory(item.categoryId).subscribe((stockItems) => {
      const stockItem = stockItems.find((s) => s.name === item.name);
      this.selectedItem.set({
        ...item,
        quantity: stockItem?.quantity ?? 0,
        status: (stockItem?.quantity ?? 0) < (item.minQuantity ?? 0) ? 0 : 1,
      });
      this.visible = true;
    });
  }

  startEdit(item: Item) {
    this.editableItem.set({ ...item, categoryId: Number(item.categoryId) });
    this.editDialogVisible.set(true);
  }

  saveEdit() {
    const updated: Item = {
      ...this.editableItem(),
      categoryId: String(this.editableItem().categoryId),
    };
    this.itemService.update(updated).subscribe(() => {
      this.items.update((current) =>
        current.map((i) => (i.id === updated.id ? updated : i)),
      );
      this.editDialogVisible.set(false);
    });
  }

  handleAdd() {
    this.newItem.set({
      name: '',
      categoryId: '',
      minQuantity: 1,
    });
    this.dialogVisible.set(true);
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

  getStatusClass(item: Item): string {
    if (item.quantity === 0) return 'badge-critical';
    if (item.quantity < item.minQuantity) return 'badge-low';
    return 'badge-ok';
  }
}