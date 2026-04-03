import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { Alert } from "../../../shared/alert/alert.component";
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, MatFormFieldModule, MatInputModule, MatIconModule, MatButton, Alert, AsyncPipe],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class Login implements OnInit {
  authService = inject(AuthService);
  router = inject(Router);

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  isLoggedIn = signal<boolean>(false);

  ngOnInit() {
    this.authService.checkMe().subscribe({
      next: res => this.isLoggedIn.set(res)
    });
  }

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

    this.authService.login(email, password).subscribe({
      next: () => this.router.navigateByUrl('/')
    })
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigateByUrl('/login');
        this.authService.clearCache();
      }
    });
  }
}
