import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of, shareReplay } from 'rxjs';
import { UserResponse } from './auth.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  private authCheck$?: Observable<boolean>;

  login(email: string, password: string) {
    return this.http.post(this.apiUrl + "login", { email, password }, { withCredentials: true });
  }

  register(email: string, password: string) {
    return this.http.post(this.apiUrl + "register", { email, password }, { withCredentials: true });
  }

  logout() {
    return this.http.post(this.apiUrl + 'logout', {}, { withCredentials: true })
  }

  checkMe(): Observable<boolean> {
    if (!this.authCheck$) {
      this.authCheck$ = this.http.get<UserResponse>(this.apiUrl + 'me', {
        withCredentials: true
      }).pipe(
        map(res => !!res.email),
        shareReplay(1),
        catchError(() => {
          this.clearCache();
          return of(false);
        })
      );
    }

    return this.authCheck$;
  }

  clearCache() {
    this.authCheck$ = undefined;
  }
}
