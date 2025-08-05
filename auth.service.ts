import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User } from '../models/user.model';
import { Login } from '../models/login.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public apiUrl = 'https://8080-abeecbbbdbedfffbcadcffcbecabfaedfdcf.premiumproject.examly.io/api';
  private userRole = new BehaviorSubject<string>('');
  private userId = new BehaviorSubject<number>(0);
  private username = new BehaviorSubject<string>('');

  userRole$ = this.userRole.asObservable();
  userId$ = this.userId.asObservable();
  username$ = this.username.asObservable();

  constructor(private http: HttpClient) {
    this.checkToken();
  }

  // Check if token exists and is valid
  private checkToken(): void {
    const token = localStorage.getItem('jwtToken');
    const role = localStorage.getItem('userRole');
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username');

    if (token && role && userId && username) {
      this.userRole.next(role);
      this.userId.next(Number(userId));
      this.username.next(username);
    }
  }

  // Register a new user
  register(user: User): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user, { responseType: 'text' });
  }

  // Login user
  login(login: Login): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, login, { responseType: 'text' })
      .pipe(
        tap((response: any) => {
          const parsedResponse = typeof response === 'string' ? JSON.parse(response) : response;
          
          localStorage.setItem('jwtToken', parsedResponse.token);
          localStorage.setItem('userId', parsedResponse.user.id);
          localStorage.setItem('username', parsedResponse.user.username);
          localStorage.setItem('userRole', parsedResponse.role);
          
          this.userRole.next(parsedResponse.role);
          this.userId.next(parsedResponse.user.id);
          this.username.next(parsedResponse.user.username);
          
        })
      );
  }

  // Logout user
  logout(): void {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('userRole');
    
    this.userRole.next('');
    this.userId.next(0);
    this.username.next('');
  }

  // Get user role
  getUserRole(): string {
    return localStorage.getItem('userRole') || '';
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return !!localStorage.getItem('jwtToken');
  }

  // Check if user is admin
  isAdmin(): boolean {
    return this.getUserRole() === 'Admin';
  }

  // Check if user is regular user
  isUser(): boolean {
    return this.getUserRole() === 'User';
  }

  // Get user info
  getUserInfo(): { id: number, username: string } {
    return {
      id: +localStorage.getItem('userId'),
      username: localStorage.getItem('username') || ''
    };
  }
}