import { Component, inject, signal, OnInit } from '@angular/core';
import { USER_SERVICE_TOKEN } from '../../core/user/user-service.token';

import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { SpeedDialModule } from 'primeng/speeddial';
import { MenuItem } from 'primeng/api';
import { User, type UserRole } from '../../core/user/user.model';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Dialog } from 'primeng/dialog';
import { Button } from 'primeng/button';
import { Select } from 'primeng/select';
import { InputText } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-user-settings',
  standalone: true,
  imports: [
    TableModule,
    TagModule,
    SpeedDialModule,
    Dialog,
    Button,
    ReactiveFormsModule,
    Select,
    InputText,
    ProgressSpinnerModule,
  ],
  templateUrl: './user-settings.html',
  styleUrl: './user-settings.css',
})
export class UserSettings implements OnInit {
  private userService = inject(USER_SERVICE_TOKEN);
  users = this.userService.allUsers;

  loading = signal(false);

  userActions: MenuItem[] = [];
  displayDialog = signal(false);

  //  per gestire la visibilità del cestino
  isDeleteMode = signal<Boolean>(false);

  isEditMode = signal(false); // per mostrare la colonna con la matita
  selectedUser: User | null = null; // per memorizzar l'utente da modificare

  // Proprietà tradotte per l'header del dialog nel template
  editTitle = $localize`@@userSettings.dialog.editTitle:Edit User`;
  newTitle = $localize`@@userSettings.dialog.newTitle:New User`;

  ngOnInit() {
    this.updateMenu();
    this.fetchInitialData();
  }

  fetchInitialData() {
    this.loading.set(true);
    this.userService.loadUsers().subscribe({
      next: () => this.loading.set(false),
      error: () => this.loading.set(false),
    });
  }

  updateMenu() {
    this.userActions = [
      {
        icon: 'pi pi-user-plus',
        tooltipOptions: { tooltipLabel: $localize`:@@userSettings.actions.addUser:Add User` },
        command: () => this.openDialog(), // Modo creazione
      },
      {
        icon: 'pi pi-pencil',
        tooltipOptions: { tooltipLabel: $localize`:@@userSettings.actions.editUsers:Edit Users` },
        command: () => {
          this.isEditMode.set(!this.isEditMode());
          this.isDeleteMode.set(false); // Chiudiamo delete se aperto
        },
      },
      {
        icon: 'pi pi-trash',
        tooltipOptions: {
          tooltipLabel: $localize`:@@userSettings.actions.deleteUsers:Delete Users`,
        },
        command: () => {
          this.isDeleteMode.set(!this.isDeleteMode());
          this.isEditMode.set(false); // Chiudiamo edit se aperto
        },
      },
    ];
  }

  // Apre il dialog per la MODIFICA
  openEditDialog(user: User) {
    this.selectedUser = user;
    // Pre-compila il form con i dati dell'utente
    this.userForm.patchValue({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    });
    this.displayDialog.set(true);
  }

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
    { label: $localize`@@role.admin:Administrator`, value: 'admin' },
    { label: $localize`@@role.medical:Medical Area`, value: 'medicalArea' },
    { label: $localize`@@role.office:Office`, value: 'officeArea' },
    { label: $localize`@@role.security:Security`, value: 'securityArea' },
    { label: $localize`@@role.break:Break Area`, value: 'breakArea' },
  ];

  openDialog() {
    this.selectedUser = null;
    this.userForm.reset();
    this.displayDialog.set(true);
  }

  saveUser() {
    if (this.userForm.valid) {
      const formData = this.userForm.getRawValue();

      if (this.selectedUser) {
        // MODIFICA utente
        const updatedUser = { ...this.selectedUser, ...formData };
        this.userService.updateUser(updatedUser).subscribe({
          next: () => this.closeDialog(),
          error: (err) => alert(err.message),
        });
      } else {
        // CREAZIONE utente
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
      $localize`@@userSettings.confirmDelete:Are you sure you want to delete the user ${user.firstName} ${user.lastName}?`,
    );

    if (confirmDelete && user.id) {
      this.userService.deleteUser(user.id).subscribe({
        next: () => {
          console.log('User successfully deleted');
        },
        error: (err) => alert(err.message),
      });
    }
  }
}
