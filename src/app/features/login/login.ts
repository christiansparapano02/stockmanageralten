import { Component, inject, OnInit, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { form } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';
import { ProgressSpinner } from "primeng/progressspinner";

function uppercaseValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value || '';

  // Controlla se c'è una lettera maiuscola
  const haMaiuscola = /[A-Z]/.test(value);

  // Se ce l'ha, restituisce null (nessun errore, tutto ok!)
  // Se NON ce l'ha, restituisce un oggetto con il nome dell'errore
  return haMaiuscola ? null : { mancaMaiuscola: true };
}

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  styleUrl: './login.css',
  imports: [ReactiveFormsModule, InputTextModule, PasswordModule, ButtonModule, RouterLink, ProgressSpinner],
})
export class LoginComponent implements OnInit {
  private fb = inject(FormBuilder);

  loading = signal(false);

  ngOnInit(): void {
    this.loading.set(true);
    setTimeout(() => {
      this.loading.set(false);
    }, 1000);
  }

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6), uppercaseValidator]],
  });

  get emailIsInvalid() {
    return (
      this.loginForm.controls.email.touched &&
      this.loginForm.controls.email.dirty &&
      this.loginForm.controls.email.invalid
    );
  }

  get passwordIsInvalid() {
    return (
      this.loginForm.controls.password.touched &&
      this.loginForm.controls.password.dirty &&
      this.loginForm.controls.password.invalid
    );
  }

  onSubmit() {
    console.log(this.loginForm);
  }

  // onSubmit(formData: NgForm): void {
  //   const enteredEmail = formData.form.value.email;
  //   const enteredPassword = formData.form.value.password;

  //   if (this.loginForm.invalid) {
  //     this.loginForm.markAllAsTouched();
  //     return;
  //   }

  //console.log('Form values:', this.loginForm.value);
  // Qui fai la tua chiamata al servizio di login
  //}
}
