import { Component, OnInit } from '@angular/core';
import { ApiService } from '../shared/api.service';
import { Router } from '@angular/router';
import { PostService } from '../services/post.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastController } from '@ionic/angular';

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
    private postService: PostService,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.loadPerfil();
  }

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

  async presentToast(message: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message,
      duration: 6000,
      color,
      position: 'bottom'
    });
    toast.present();
  }

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
        this.presentToast('Perfil atualizado com sucesso!', 'success');
      },
      error: (err) => {
        console.error('Erro ao atualizar perfil:', err);
        this.presentToast('Erro ao atualizar perfil. Tente novamente.', 'danger');
      }
    });
  }

  uploadFotoPerfil(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.postService.uploadFotoPerfil(file).subscribe({
        next: (res: any) => {
          console.log('Foto enviada com sucesso', res);
          this.user.picture = res.picture_url;

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
          this.presentToast('Erro ao enviar a foto: ' + (err.error?.message || 'Verifique o formato e tamanho.'), 'danger');
        }
      });
    }
  }

  deletarPost(postId: number) {
    if (!confirm('Tem certeza que deseja excluir este post?')) return;

    this.api.delete(`posts/${postId}`).subscribe({
      next: () => {
        this.posts = this.posts.filter(p => p.id !== postId);
        this.presentToast('Post excluído com sucesso!', 'success');
      },
      error: (err) => {
        console.error('Erro ao excluir post:', err);
        this.presentToast('Erro ao excluir post. Tente novamente.', 'danger');
      }
    });
  }

  formatarUrl(url: string | undefined | null): string {
    if (!url || url.trim() === '' || url === 'null') {
      return 'assets/icon/perfil.png'; 
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
