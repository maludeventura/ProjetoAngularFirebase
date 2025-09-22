import { Component, OnInit } from '@angular/core';
import { ApiService } from '../shared/api.service';
import { Router } from '@angular/router';

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

  constructor(private api: ApiService, private router: Router) {}

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

salvarEdicao() {
  const dadosAtualizados: any = {
    name: this.user.name,
    email: this.user.email
  };

  if (this.novaSenha) {
    dadosAtualizados.password = this.novaSenha;
    dadosAtualizados.password_confirmation = this.novaSenha; // aqui
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
}
