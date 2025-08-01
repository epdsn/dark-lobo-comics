import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  username: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:5292/api/auth';
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadStoredAuth();
  }

  private loadStoredAuth(): void {
    // Only load stored auth if we're in the browser
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = this.getToken();
      const user = this.getStoredUser();
      if (token && user) {
        this.currentUserSubject.next(user);
      }
    }
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    console.log('Making login request to:', `${this.API_URL}/login`);
    console.log('Credentials:', credentials);
    
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials)
      .pipe(
        tap(response => {
          console.log('Login response received:', response);
          this.setToken(response.token);
          this.setUser(response.user);
          this.currentUserSubject.next(response.user);
          console.log('Token set, current token:', this.getToken());
        })
      );
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    console.log('Making register request to:', `${this.API_URL}/register`);
    console.log('User data:', userData);
    console.log('Request headers will include:', {
      'Content-Type': 'application/json',
      'Authorization': this.getToken() ? `Bearer ${this.getToken()}` : 'None'
    });
    
    return this.http.post<AuthResponse>(`${this.API_URL}/register`, userData)
      .pipe(
        tap(response => {
          console.log('Register response received:', response);
          this.setToken(response.token);
          this.setUser(response.user);
          this.currentUserSubject.next(response.user);
        })
      );
  }

  getProfile(): Observable<User> {
    console.log('Making getProfile request to:', `${this.API_URL}/profile`);
    console.log('Current token:', this.getToken());
    
    return this.http.get<User>(`${this.API_URL}/profile`)
      .pipe(
        tap(user => {
          console.log('Profile response received:', user);
          this.setUser(user);
          this.currentUserSubject.next(user);
        })
      );
  }

  updateProfile(userData: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.API_URL}/profile`, userData)
      .pipe(
        tap(user => {
          this.setUser(user);
          this.currentUserSubject.next(user);
        })
      );
  }

  logout(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
    }
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  private setToken(token: string): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  private setUser(user: User): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }
  }

  private getStoredUser(): User | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      const userStr = localStorage.getItem(this.USER_KEY);
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
} 