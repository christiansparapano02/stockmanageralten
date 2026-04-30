import { Component, inject, signal, OnInit } from '@angular/core';
import { USER_SERVICE_TOKEN } from '../../core/user/user-service.token';

import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { MenuModule } from 'primeng/menu';
import { User } from '../../core/user/user.model';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Dialog } from 'primeng/dialog';
import { Button, ButtonModule } from 'primeng/button';
import { Select, SelectModule } from 'primeng/select';
import { InputText } from 'primeng/inputtext';
import { SkeletonModule } from 'primeng/skeleton';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { MenuItem, ConfirmationService, MessageService } from 'primeng/api';

import { PasswordModule } from 'primeng/password';
import { OFFICE_SERVICE_TOKEN } from '../../core/office/office-service.token';
import { ROLE_SERVICE_TOKEN } from '../../core/role/role-service.token';
import { SessionService } from '../../shared/services/session.service';

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
    SkeletonModule,
    ConfirmDialogModule,
    ToastModule,
    PasswordModule,
    MenuModule,
    ButtonModule,
    SelectModule,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './user-settings.html',
  styleUrl: './user-settings.css',
})
export class UserSettings implements OnInit {
  private userService = inject(USER_SERVICE_TOKEN);
  private officeService = inject(OFFICE_SERVICE_TOKEN);
  private roleService = inject(ROLE_SERVICE_TOKEN);
  private session = inject(SessionService);

  private confirmationService = inject(ConfirmationService); // per delete user
  private messageService = inject(MessageService);

  //poi scommentare dopo attivazione sessionService
  //readonly currentOfficeId = this.session.userOfficeId;
  readonly TEMP_OFFICE_ID = '95648c6f-b0aa-458f-98a2-a9b98c15290b'; //per simulazione admin, dovrebbe arrivare da sessionService

  users = this.userService.allUsers;
  roles = this.roleService.allRoles;
  officeInfo = signal<any>(null);

  loading = signal(false);

  displayDialog = signal(false);
  selectedUser = signal<User | null>(null); // per memorizzar l'utente da modificare

  // Proprietà tradotte per l'header del dialog nel template
  editTitle = $localize`:@@userSettings.dialog.editTitle:Edit User`;
  newTitle = $localize`:@@userSettings.dialog.newTitle:New User`;

  // messaggi toast
  private showSuccess(detail: string) {
    this.messageService.add({ severity: 'success', summary: 'Success', detail });
  }
  private showError(detail: string) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail });
  }

  //per ricavare nome del ruolo dal RoleService, partendo dal roleId dell'utente
  getRoleName(roleId: string): string {
    const role = this.roles().find((r) => r.id === roleId);
    return role ? role.roleName : 'N/A';
  }

  ngOnInit() {
    this.fetchInitialData();
  }

  //carichiamo info ufficio, ruoli, utenti filtrati per ufficio
  fetchInitialData() {
    this.loading.set(true);
    const officeId = this.TEMP_OFFICE_ID;
    // loadService dovrebbe essere chiamata nell authService
    this.roleService.loadRoles().subscribe();

    this.officeService.getOfficeById(officeId).subscribe({
      next: (office) => {
        this.officeInfo.set(office);
        this.loadUsersData(officeId);
      },
      error: (err) => {
        this.showError('Office ID not found.');
      },
    });
  }

  private loadUsersData(id: string) {
    this.userService.loadUsers(id).subscribe({
      next: () => this.loading.set(false),
      error: () => {
        this.showError('Failed to load users');
        this.loading.set(false);
      },
    });
  }

  MenuItems(event: Event, user: User) {
    this.selectedUser.set(user);
  }

  MenuItem = [
    {
      label: $localize`:@@userSettings.actions.editUsers:Edit User`,
      icon: 'pi pi-pencil',
      command: () => this.openEditDialog(this.selectedUser()!),
    },
    {
      label: $localize`:@@userSettings.actions.deleteUsers:Delete User`,
      icon: 'pi pi-trash',
      command: () => this.deleteUser(this.selectedUser()!),
    },
  ];

  userForm = new FormGroup({
    firstName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    lastName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    phone: new FormControl('', { nonNullable: true }),
    roleId: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    password: new FormControl('', { nonNullable: true }), //non required perchè nella modifica dell'utente non deve essere obbligatoria
  });

  //dialog per nuovo utente
  openDialog() {
    this.selectedUser.set(null);
    this.userForm.reset();
    this.userForm.get('password')?.enable(); //per abilitare campo password che potrebbe essere stao disabilitato nella versione edit
    this.userForm.get('password')?.setValidators([
      Validators.required,
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/), //per settare validators (in linea con be)
    ]);
    this.userForm.get('password')?.updateValueAndValidity(); //per dire ad angular di ricalcolare se il campo (e tutto il form) è valido
    this.displayDialog.set(true);
  }

  //dialog per modifica utente
  openEditDialog(user: User) {
    // Pre-compila il form con i dati dell'utente
    this.selectedUser.set(user);

    //in modifica campo password non richiesto, quindi disabilitato
    this.userForm.get('password')?.clearValidators();
    this.userForm.get('password')?.disable();

    this.userForm.patchValue({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      roleId: user.roleId,
      password: 'password', //valore fittizio
    });
    this.displayDialog.set(true);
  }

  saveUser() {
    if (this.userForm.invalid) return;

    const formData = this.userForm.getRawValue(); //include tutti i campi, anche quelli disabilitati, per non perdere dati
    const currentUser = this.selectedUser();
    //se in edit user:
    if (currentUser) {
      const { password, ...userDataWithoutPassword } = formData; //destructuring per separarare la password (non serve in update)

      const updatedUser: User = {
        ...userDataWithoutPassword,
        id: currentUser.id,
        officeId: this.TEMP_OFFICE_ID, // sostituire con officeId
        isConfirmed: currentUser.isConfirmed, // Mantiene lo stato attuale
      };

      this.userService.updateUser(updatedUser).subscribe({
        next: () => {
          this.showSuccess($localize`:@@userSettings.msg.updated:User updated successfully`);
          this.closeDialog();
        },
        error: (err) => this.showError(err.message),
      });
    } else {
      //modalità creazione utente
      const newUser: User = {
        ...formData,
        officeId: this.TEMP_OFFICE_ID, // sostituire con officeId
        isConfirmed: false,
      };
      this.userService.addUser(newUser).subscribe({
        next: () => {
          this.showSuccess($localize`:@@userSettings.msg.added:User added successfully`);
          this.closeDialog();
        },
        error: (err) => this.showError(err.message),
      });
    }
  }

  closeDialog() {
    this.displayDialog.set(false);
    this.selectedUser.set(null);
    this.userForm.reset();
  }

  deleteUser(user: User) {
    this.confirmationService.confirm({
      message: $localize`:@@userSettings.confirmDelete:Are you sure you want to delete the user ${user.firstName} ${user.lastName}?`,
      header: $localize`:@@userSettings.confirmHeader:Delete Confirmation`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: $localize`:@@userSettings.yes:Yes`,
      rejectLabel: $localize`:@@userSettings.no:No`,
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        if (user.id) {
          this.userService.deleteUser(user.id).subscribe({
            next: () => {
              this.showSuccess($localize`:@@userSettings.msg.deleted:User deleted successfully`);
            },
            error: (err) => this.showError(err.message),
          });
        }
      },
    });
  }
}
