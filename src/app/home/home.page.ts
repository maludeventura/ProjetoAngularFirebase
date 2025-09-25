// ...existing code...
// ...existing code...
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PostService } from '../services/post.service';
import { ApiService } from '../shared/api.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  posts: any[] = [];
  newPost: string = '';
  currentUserId: number | null = null;
  user: any = null;

  replyInputs: { [key: number]: boolean } = {};
  replyTexts: { [key: number]: string } = {};

  postImageBase64: string = '';

  constructor(
    private postService: PostService,
    private router: Router,
    private api: ApiService,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.loadCurrentUserId();
    this.loadUser();
    this.loadPosts();
  }

  triggerFileInput() {
    const fileInput = document.getElementById('fileInput-post') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
      fileInput.click();
    }
  }

  onFileSelected(event: any) {
    const file: File = event.target.files && event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.postImageBase64 = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  loadCurrentUserId() {
    const storedId = localStorage.getItem('userId');
    this.currentUserId = storedId ? Number(storedId) : null;
    console.log('currentUserId:', this.currentUserId);
  }

  loadUser() {
    if (!this.isLoggedIn()) return;
    this.api.post('usuario/perfil', {}).subscribe({
      next: (resp: any) => {
        this.user = resp;
      },
      error: (err) => {
        console.error('Erro ao carregar usuário na home', err);
      }
    });
  }

  formatarUrl(url: string | undefined | null): string {
    if (!url || url.trim() === '' || url.toLowerCase() === 'null') {
      return 'assets/icon/meu-perfil.png';
    }
    if (url.startsWith('http')) {
      return url;
    }
    return `http://localhost:8000${url}`;
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    this.router.navigate(['/home']);
    setTimeout(() => this.loadPosts(), 300);
  }

  loadPosts() {
    this.postService.getPosts().subscribe({
      next: (data) => this.posts = data,
      error: (err) => console.error(err)
    });
  }

  addPost() {
    if (!this.newPost.trim()) return;

    this.postService.createPost(this.newPost, this.postImageBase64).subscribe({
      next: (post) => {
        this.posts.unshift(post);
        this.newPost = '';
        this.postImageBase64 = '';
        const fileInput = document.getElementById('fileInput-post') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      },
      error: (err) => console.error(err)
    });
  }

  toggleReply(postId: number) {
    this.replyInputs[postId] = !this.replyInputs[postId];
  }

  addReply(post: any) {
    const replyText = this.replyTexts[post.id];
    if (!replyText?.trim()) return;

    if (!post.replies) {
      post.replies = [];
    }

    post.replies.push({
      user: {
        name: this.user?.name || "Você",
        picture: this.user?.picture || null
      },
      description: replyText,
      created_at: new Date()
    });

    this.replyTexts[post.id] = '';
    this.replyInputs[post.id] = false;
  }

  async deletePost(postId: number) {
    const toast = await this.toastController.create({
      message: 'Deseja realmente excluir este post?',
      position: 'bottom',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            // Cancelou, não faz nada
          }
        },
        {
          text: 'Excluir',
          handler: () => {
            this.postService.deletePost(postId).subscribe({
              next: () => {
                this.posts = this.posts.filter(post => post.id !== postId);
                this.presentToast('Post excluído com sucesso.');
              },
              error: (err) => {
                console.error('Erro ao excluir o post', err);
                this.presentToast('Erro ao excluir o post.');
              }
            });
          }
        }
      ]
    });

    await toast.present();
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  toggleLike(post: any) {
    if (!post.likes_count) post.likes_count = 0;
    if (post.liked) {
      post.likes_count--;
      post.liked = false;
    } else {
      post.likes_count++;
      post.liked = true;
    }
    // Aqui você pode chamar o serviço para salvar no backend se desejar
    // this.postService.likePost(post.id, post.liked).subscribe();
  }
}
