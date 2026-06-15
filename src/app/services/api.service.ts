import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  // AUTH
  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, data);
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, data);
  }

  // USERS
  getMe(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/me`);
  }

  getMyStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/me/stats`);
  }

  updateProfile(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/me`, data);
  }

  // VOCABULARY
  getVocabulary(categoria?: string, nivel?: string, search?: string): Observable<any> {
    let url = `${this.apiUrl}/vocabulary`;
    const params = new URLSearchParams();
    
    if (categoria) params.append('categoria', categoria);
    if (nivel) params.append('nivel', nivel);
    if (search) params.append('search', search);

    const queryString = params.toString();
    return this.http.get(queryString ? `${url}?${queryString}` : url);
  }

  getRandomVocabulary(): Observable<any> {
    return this.http.get(`${this.apiUrl}/vocabulary/random`);
  }

  getCategorias(): Observable<any> {
    return this.http.get(`${this.apiUrl}/vocabulary/categorias`);
  }

  getNiveles(): Observable<any> {
    return this.http.get(`${this.apiUrl}/vocabulary/niveles`);
  }

  // PROGRESS
  getMyProgress(): Observable<any> {
    return this.http.get(`${this.apiUrl}/progress/me`);
  }

  getMyProgressStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/progress/me/stats`);
  }

  recordPractice(vocabularyId: string, isCorrect: boolean): Observable<any> {
    return this.http.post(`${this.apiUrl}/progress/me/${vocabularyId}/practice`, {
      isCorrect,
    });
  }

  updateProgress(vocabularyId: string, data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/progress/me/${vocabularyId}`, data);
  }
}