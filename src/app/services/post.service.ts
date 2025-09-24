import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private apiUrl = 'http://127.0.0.1:8000/api/usuario'; 

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

  // Criar post (com texto e opcionalmente uma imagem em string/base64)
  createPost(description: string, picture: string = ''): Observable<any> {
    return this.http.post(`${this.apiUrl}/posts`,
      { description, picture },
      { headers: this.getHeaders() }
    );
  }

  // Deletar post
  deletePost(postId: number) {
    return this.http.delete(`${this.apiUrl.replace('/usuario','')}/posts/${postId}`, {
      headers: this.getHeaders()
    });
  }

  // 👉 Novo: Upload de foto de perfil
  uploadFotoPerfil(file: File): Observable<any> {
    const formData = new FormData();
formData.append('picture', file); // nome correto compatível com o Laravel


return this.http.post(`${this.apiUrl}/foto-upload`, formData, {
  headers: this.getHeaders()
});

  }
}
