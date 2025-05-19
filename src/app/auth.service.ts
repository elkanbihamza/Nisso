import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api/auth'; // adapte à ton URL

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, mot_de_passe: string) {
    return this.http.post<any>(`${this.apiUrl}/login`, {
      email,
      mot_de_passe
    });
  }

  logout() {
    localStorage.removeItem('access_token');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('access_token');
  }

  saveToken(token: string) {
    localStorage.setItem('access_token', token);
  }
}
