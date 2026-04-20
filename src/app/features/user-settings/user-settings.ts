import { Component, inject, signal, OnInit } from '@angular/core';
import { USER_SERVICE_TOKEN } from '../../core/user/user-service.token';

import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { MenuItem } from 'primeng/api';
import { User, type UserRole } from '../../core/user/user.model';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Dialog } from 'primeng/dialog';
import { Button } from 'primeng/button';
import { Select } from 'primeng/select';
import { InputText } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SpeedDialComponent } from '../../features/speeddial/speeddial';
import { SpeedDial } from "primeng/speeddial"; // adatta il path

@Component({
  selector: 'app-user-settings',
  standalone: true,
  imports: [
    TableModule,
    TagModule,
    Dialog,
    Button,
    ReactiveFormsModule,
    Select,
    InputText,
    ProgressSpinnerModule,
    SpeedDialComponent,
    SpeedDial
],
  templateUrl: './user-settings.html',
  styleUrl: './user-settings.css',
})
export class UserSettings implements OnInit {
  private userService = inject(USER_SERVICE_TOKEN);
  users = this.userService.allUsers;

  loading = signal(false);
  displayDialog = signal(false);
  isDeleteMode = signal<Boolean>(false);
  isEditMode = signal(false);
  selectedUser: User | null = null;

  userActions: MenuItem[] = [
    {
      icon: 'pi pi-user-plus',
      tooltipOptions: { tooltipLabel: 'Add User' },
      command: () => this.openDialog(),
    },
    {
      icon: 'pi pi-pencil',
      tooltipOptions: { tooltipLabel: 'Edit Users' },
      command: () => {
        this.isEditMode.set(!this.isEditMode());
        this.isDeleteMode.set(false);
      },
    },
    {
      icon: 'pi pi-trash',
      tooltipOptions: { tooltipLabel: 'Delete Users' },
      command: () => {
        this.isDeleteMode.set(!this.isDeleteMode());
        this.isEditMode.set(false);
      },
    },
  ];

  userForm = new FormGroup({
    firstName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    lastName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    role: new FormControl<UserRole>('' as UserRole, {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  roleOptions = [
    { label: $localize`:@@role.admin:Administrator`, value: 'admin' },
    { label: $localize`:@@role.medical:Medical Area`, value: 'medicalArea' },
    { label: $localize`:@@role.office:Office`, value: 'officeArea' },
    { label: $localize`:@@role.security:Security`, value: 'securityArea' },
    { label: $localize`:@@role.break:Break Area`, value: 'breakArea' },
  ];

  ngOnInit() {
    this.fetchInitialData();
  }

  fetchInitialData() {
    this.loading.set(true);
    this.userService.loadUsers().subscribe({
      next: () => this.loading.set(false),
      error: () => this.loading.set(false),
    });
  }

  openDialog() {
    this.selectedUser = null;
    this.userForm.reset();
    this.displayDialog.set(true);
  }

  openEditDialog(user: User) {
    this.selectedUser = user;
    this.userForm.patchValue({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    });
    this.displayDialog.set(true);
  }

  saveUser() {
    if (this.userForm.valid) {
      const formData = this.userForm.getRawValue();

      if (this.selectedUser) {
        const updatedUser = { ...this.selectedUser, ...formData };
        this.userService.updateUser(updatedUser).subscribe({
          next: () => this.closeDialog(),
          error: (err) => alert(err.message),
        });
      } else {
        this.userService.addUser(formData).subscribe({
          next: () => this.closeDialog(),
          error: (err) => alert(err.message),
        });
      }
    }
  }

  closeDialog() {
    this.displayDialog.set(false);
    this.selectedUser = null;
    this.userForm.reset();
  }

  deleteUser(user: User) {
    const confirmDelete = confirm(
      $localize`:@@userSettings.confirmDelete:Are you sure you want to delete the user ${user.firstName} ${user.lastName}?`,
    );

    if (confirmDelete && user.id) {
      this.userService.deleteUser(user.id).subscribe({
        next: () => console.log('User successfully deleted'),
        error: (err) => console.error('Error during deletion:', err),
      });
    }
  }
}