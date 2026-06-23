import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User, AuthResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth';
  private http = inject(HttpClient);

  private _currentUser = signal<User | null>(null);
  readonly currentUser = this._currentUser.asReadonly();
  readonly isLoggedIn = computed(() => this._currentUser() !== null);

  constructor() {
    this.loadUserFromStorage();
  }

  register(email: string, password: string, nombre: string, idiomaNativo: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, {
      email,
      password,
      nombre,
      idiomaNativo,
    }).pipe(
      tap((response) => this.saveToken(response.accessToken, response.user))
    );
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, {
      email,
      password,
    }).pipe(
      tap((response) => this.saveToken(response.accessToken, response.user))
    );
  }

  private saveToken(token: string, user: User): void {
    localStorage.setItem('accessToken', token);
    localStorage.setItem('user', JSON.stringify(user));
    this._currentUser.set(user);
  }

  private loadUserFromStorage(): void {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('accessToken');

    if (user && token) {
      this._currentUser.set(JSON.parse(user) as User);
    }
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    this._currentUser.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  // shim temporal para HomeComponent — eliminar en T6
  getCurrentUser(): User | null {
    return this._currentUser();
  }
}
