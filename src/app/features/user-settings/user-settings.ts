import { Component, inject, signal, OnInit } from '@angular/core';
import { USER_SERVICE_TOKEN } from '../../core/user/user-service.token';

import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { SpeedDialModule } from 'primeng/speeddial';
import { MenuItem } from 'primeng/api';
import { User } from '../../core/user/user.model';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Dialog } from 'primeng/dialog';
import { Button } from 'primeng/button';
import { Select } from 'primeng/select';
import { InputText } from 'primeng/inputtext';
import { SkeletonModule } from 'primeng/skeleton';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';

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
    SpeedDialModule,
    Dialog,
    Button,
    ReactiveFormsModule,
    Select,
    InputText,
    SkeletonModule,
    ConfirmDialogModule,
    ToastModule,
    PasswordModule,
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

  userActions: MenuItem[] = [];
  displayDialog = signal(false);

  isDeleteMode = signal<Boolean>(false); //  per gestire la visibilità del cestino
  isEditMode = signal(false); // per mostrare la colonna con la matita
  selectedUser: User | null = null; // per memorizzar l'utente da modificare

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
    this.updateMenu();
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

  //fetchInitalData con session
  // fetchInitialData() {
  //   const officeId = this.currentOfficeId();

  //   if (!officeId) {
  //     this.showError('No Office ID found in session.');
  //     return;
  //   }

  //   this.loading.set(true);

  //   /**
  //    * [PROMEMORIA API]: Non chiamiamo più roleService.loadRoles() qui.
  //    * I ruoli sono già stati caricati dall'AuthService durante il login.
  //    */

  //   this.officeService.getOfficeById(officeId).subscribe({
  //     next: (office) => {
  //       this.officeInfo.set(office);
  //       this.loadUsersData(officeId);
  //     },
  //     error: () => {
  //       this.showError('Office details not found.');
  //       this.loading.set(false);
  //     },
  //   });
  // }

  private loadUsersData(id: string) {
    this.userService.loadUsers(id).subscribe({
      next: () => this.loading.set(false),
      error: () => {
        this.showError('Failed to load users');
        this.loading.set(false);
      },
    });
  }

  //configurazione menù SpeedDial
  updateMenu() {
    this.userActions = [
      {
        icon: 'pi pi-user-plus',
        tooltipOptions: { tooltipLabel: $localize`:@@userSettings.actions.addUser:Add User` },
        command: () => this.openDialog(),
      },
      {
        icon: 'pi pi-pencil',
        tooltipOptions: { tooltipLabel: $localize`:@@userSettings.actions.editUsers:Edit Users` },
        command: () => {
          this.isEditMode.set(!this.isEditMode());
          this.isDeleteMode.set(false);
        },
      },
      {
        icon: 'pi pi-trash',
        tooltipOptions: {
          tooltipLabel: $localize`:@@userSettings.actions.deleteUsers:Delete Users`,
        },
        command: () => {
          this.isDeleteMode.set(!this.isDeleteMode());
          this.isEditMode.set(false);
        },
      },
    ];
  }

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
    this.selectedUser = null;
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
    this.selectedUser = user;

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
    //const officeId = this.currentOfficeId(); // Recuperiamo l'ID dinamico (SESSION)

    //se in edit user:
    if (this.selectedUser) {
      const { password, ...userDataWithoutPassword } = formData; //destructuring per separarare la password (non serve in update)

      const updatedUser: User = {
        ...userDataWithoutPassword,
        id: this.selectedUser.id,
        officeId: this.TEMP_OFFICE_ID, // sostituire con officeId
        isConfirmed: this.selectedUser.isConfirmed, // Mantiene lo stato attuale
      };

      this.userService.updateUser(updatedUser).subscribe({
        next: () => {
          this.showSuccess($localize`:@@userSettings.msg.updated:User updated successfully`);
          this.closeDialog();
        },

        error: (err) => this.showError(err.message), //this.showError(err.error) o err.error.message per vedere messaggio specifico mandato da be
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
    this.selectedUser = null;
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
