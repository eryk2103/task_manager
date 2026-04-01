import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from "@angular/router";
import { AuthService } from '../auth.service';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink, MatFormField, MatError, MatLabel, MatInput, MatButton],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class Register {
  authService = inject(AuthService);
  router = inject(Router);

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  get email() {
    return this.form.get('email');
  }

  get password() {
    return this.form.get('password');
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const email = this.email?.value || '';
    const password = this.password?.value || '';

    this.authService.register(email, password).subscribe({
      next: () => this.router.navigateByUrl('/')
    })
  }
}
