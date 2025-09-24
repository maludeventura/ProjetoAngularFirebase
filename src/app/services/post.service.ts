import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private apiUrl = 'http://127.0.0.1:8000/api/usuario';

  constructor(private http: HttpClient) { }

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

  // Criar post (com texto e opcionalmente uma imagem como arquivo)
  createPost(description: string, pictureBase64: string = ''): Observable<any> {
    const formData = new FormData();
    formData.append('description', description);
    if (pictureBase64) {
      // Converter base64 para arquivo
      const arr = pictureBase64.split(',');
      const mimeMatch = arr[0].match(/:(.*?);/);
      const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      const file = new File([u8arr], 'imagem.jpg', { type: mime });
      formData.append('picture', file);
    }
    return this.http.post(`${this.apiUrl}/posts`, formData, {
      headers: this.getHeaders().delete('Content-Type') // FormData não pode ter Content-Type manual
    });
  }

  // Deletar post
  deletePost(postId: number) {
    return this.http.delete(`${this.apiUrl.replace('/usuario', '')}/posts/${postId}`, {
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
