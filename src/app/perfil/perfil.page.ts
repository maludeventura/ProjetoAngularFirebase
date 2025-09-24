import { Component, OnInit } from '@angular/core';
import { ApiService } from '../shared/api.service';
import { Router } from '@angular/router';
import { PostService } from '../services/post.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-perfil',
  templateUrl: 'perfil.page.html',
  styleUrls: ['perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  user: any = null;
  posts: any[] = [];
  modoEdicao: boolean = false;
  novaSenha: string = '';

  constructor(
    private api: ApiService,
    private router: Router,
    private postService: PostService
  ) {}

  ngOnInit() {
    this.loadPerfil();
  }

  // Carrega os dados do usuário
  loadPerfil() {
    this.api.post('usuario/perfil', {}).subscribe({
      next: (resp: any) => {
        if (!resp) {
          console.error('Perfil não retornou dados');
          this.router.navigate(['/login']);
          return;
        }
        this.user = resp;
        this.loadPosts();
      },
      error: (err) => {
        console.error('Erro ao carregar perfil:', err);
        this.router.navigate(['/login']);
      }
      
    });
  }

  // Carrega os posts do usuário
  loadPosts() {
    this.api.get('usuario/posts').subscribe({
      next: (data: any[]) => {
        this.posts = data.filter(p => String(p.user_id) === String(this.user.id));
      },
      error: (err) => {
        this.posts = [];
      }
    });
  }

  // Salvar alterações do perfil
  salvarEdicao() {
    const dadosAtualizados: any = {
      name: this.user.name,
      email: this.user.email
    };

    if (this.novaSenha) {
      dadosAtualizados.password = this.novaSenha;
      dadosAtualizados.password_confirmation = this.novaSenha;
    }

    this.api.post('usuario/editar', dadosAtualizados).subscribe({
      next: () => {
        this.modoEdicao = false;
        this.novaSenha = '';
        this.loadPerfil();
        alert('Perfil atualizado com sucesso!');
      },
      error: (err) => {
        console.error('Erro ao atualizar perfil:', err);
        alert('Erro ao atualizar perfil. Tente novamente.');
      }
    });
  }

  // Upload da foto de perfil
// Upload da foto de perfil
uploadFotoPerfil(event: any) {
  const file = event.target.files[0];
  if (file) {
    this.postService.uploadFotoPerfil(file).subscribe({
      next: (res: any) => {
        console.log('Foto enviada com sucesso', res);
        this.user.picture = res.picture_url;

        // 👇 Atualiza o perfil no backend com a nova foto
        this.api.post('usuario/editar', {
          picture: res.picture_url
        }).subscribe({
          next: () => {
            console.log('Foto de perfil salva no banco.');
          },
          error: (err: HttpErrorResponse) => {
            console.error('Erro ao salvar foto no banco', err);
          }
        });
      },
      error: (err: HttpErrorResponse) => {
        console.error('Erro ao enviar foto', err);
        alert('Erro ao enviar a foto: ' + (err.error?.message || 'Verifique o formato e tamanho.'));
      }
    });
  }
}

  // Deletar post
  deletarPost(postId: number) {
    if (!confirm('Tem certeza que deseja excluir este post?')) return;

    this.api.delete(`posts/${postId}`).subscribe({
      next: () => {
        this.posts = this.posts.filter(p => p.id !== postId);
        alert('Post excluído com sucesso!');
      },
      error: (err) => {
        console.error('Erro ao excluir post:', err);
        alert('Erro ao excluir post. Tente novamente.');
      }
    });
  }

  // Formata a URL da imagem, ou retorna imagem padrão
formatarUrl(url: string | undefined | null): string {
  if (!url || url.trim() === '' || url === 'null') {
    return 'assets/icon/perfil.png'; // 👈 imagem padrão
  }

  if (url.startsWith('http')) {
    return url;
  }

  return `http://localhost:8000${url}`;
}

onImageError(event: any) {
  event.target.src = 'assets/icon/perfil.png';
}

}
