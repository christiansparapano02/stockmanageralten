import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';

import { RouterLink } from '@angular/router';
import { ProgressSpinner } from 'primeng/progressspinner';
import { AuthService } from '../../core/auth/auth.service';
import { MessageService } from 'primeng/api';
import { LoginCredentials } from '../../shared/models/auth.model';
import { Toast } from 'primeng/toast';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  styleUrl: './login.css',
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    RouterLink,
    ProgressSpinner,
    Toast,
  ],
  providers: [MessageService],
})
export class LoginComponent implements OnInit {
  private authService = inject(AuthService);
  private messageService = inject(MessageService);
  loading = signal(false);

  ngOnInit(): void {
    this.loading.set(true);
    setTimeout(() => {
      this.loading.set(false);
    }, 1000);
  }

  loginForm = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.email, Validators.required],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    const credentials: LoginCredentials = this.loginForm.getRawValue();

    this.loading.set(true);

    this.authService.login(credentials).subscribe({
      next: () => {},
      error: (err) => {
        this.loading.set(false);
        if (err.status === 401) {
          this.messageService.add({
            severity: 'error',
            summary: 'Autenticazione fallita',
            detail: 'Email o password non corretti',
          });
        } else {
          this.messageService.add({
            severity: 'warn',
            summary: 'Errore di Sistema',
            detail: 'Si è verificato un problema tecnico. Riprova più tardi.',
          });
        }
      },
    });
  }
}
