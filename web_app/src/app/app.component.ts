import { Component, inject } from '@angular/core';
import { RouterOutlet, Router, RouterLink } from '@angular/router';
import { AuthService } from './features/auth/auth.service';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatDivider } from "@angular/material/divider";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, MatIconButton, MatIcon, MatDivider],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class App {
  authService = inject(AuthService);
  router = inject(Router);

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigateByUrl('/login');
        this.authService.clearCache();
      }
    });
  }
}
