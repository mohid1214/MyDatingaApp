import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { LoginCreds, RegisterCreds, User } from '../../types/user';
import { tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { LikesService } from './likes-service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private http = inject(HttpClient);
  currentUser = signal<User | null>(null);
  private likesService = inject(LikesService);

  private baseUrl = environment.apiUrl;

  login(creds: LoginCreds) {
    return this.http.post<User>(this.baseUrl + 'account/login', creds
      , { withCredentials: true }
    ).pipe(
      tap(user => {
        if (user) {
          this.setCurrentUser(user);
          this.startTokenRefreshInterval();
        }
      })
    );
  }

  register(creds: RegisterCreds) {
    return this.http.post<User>(this.baseUrl + 'account/register', creds
      , { withCredentials: true }).pipe(
        tap(user => {
          if (user) {
            this.setCurrentUser(user);
            this.startTokenRefreshInterval();
          }
        })
      );
  }

  refreshToken() {
    return this.http.post<User>(this.baseUrl + 'account/refresh-token', {}, { withCredentials: true });
  }

  startTokenRefreshInterval() {
    setInterval(() => {
      this.http.post<User>(this.baseUrl + 'account/refresh-token', {}, { withCredentials: true })
      .subscribe({
        next: user => {
          this.setCurrentUser(user)
        },
        error: ()=> {
          this.logout()
        }
      })
    },5 * 60 * 1000 )
  }

  setCurrentUser(user: User) {
    user.roles = this.getRolesFromToken(user);
    console.log(user.roles);

    this.currentUser.set(user);
    this.likesService.getLikeIds();
  }

  logout() {

    this.currentUser.set(null);
    localStorage.removeItem('filters');
    this.likesService.clearLikeIds();
  }

  private getRolesFromToken(user: User): string[] {
    const payload = user.token.split('.')[1];
    const decoded = atob(payload);
    const jsonPayload = JSON.parse(decoded);
    return Array.isArray(jsonPayload.role) ? jsonPayload.role : [jsonPayload.role]
  }

}
