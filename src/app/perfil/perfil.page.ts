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
        console.log('Perfil recebido:', this.user);
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
}
