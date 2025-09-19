import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private apiUrl = 'http://127.0.0.1:8000/api'; 

  constructor(private http: HttpClient) {}

  // pega o token salvo no localStorage
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // Listar posts
  getPosts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/posts`, { headers: this.getHeaders() });
  }

  // Criar post
  createPost(description: string, picture: string = ''): Observable<any> {
    return this.http.post(`${this.apiUrl}/posts`,
      { description, picture },
      { headers: this.getHeaders() }
    );
  }
}
