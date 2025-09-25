import { Component, OnInit } from '@angular/core';
import { PostService } from '../services/post.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.page.html',
  styleUrls: ['./posts.page.scss'],
})
export class PostsPage implements OnInit {
  posts: any[] = [];
  newPost: string = '';

  // Simula usuário logado (ajuste conforme seu auth)
  userId: number = 1;

  constructor(private postService: PostService) { }

  ngOnInit() {
    this.loadPosts();
  }

  loadPosts() {
    this.postService.getPosts().subscribe({
      next: (data) => this.posts = data,
      error: (err) => console.error(err)
    });
  }

  createPost() {
    if (!this.newPost.trim()) return;

    this.postService.createPost(this.newPost).subscribe({
      next: (post) => {
        this.posts.unshift(post);
        this.newPost = '';
      },
      error: (err) => console.error(err)
    });
  }

  toggleLike(post: any) {
    if (!post.likes) post.likes = 0;
    if (post.liked) {
      post.likes--;
      post.liked = false;
    } else {
      post.likes++;
      post.liked = true;
    }
    // Aqui você pode chamar o serviço para salvar no backend se desejar
    // this.postService.likePost(post.id, post.liked).subscribe();
  }
}
