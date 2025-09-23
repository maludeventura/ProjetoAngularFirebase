import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PostService } from '../services/post.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  posts: any[] = [];
  newPost: string = '';
  currentUserId: string | null = null;

  // controle das respostas
  replyInputs: { [key: number]: boolean } = {}; 
  replyTexts: { [key: number]: string } = {};  

  constructor(private postService: PostService, private router: Router) {}

  ngOnInit() {
    this.loadCurrentUserId();
    this.loadPosts();
  }

  loadCurrentUserId() {
    this.currentUserId = localStorage.getItem('userId');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
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

    this.postService.createPost(this.newPost).subscribe({
      next: (post) => {
        this.posts.unshift(post);
        this.newPost = '';
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
      user: { name: "Você" },
      description: replyText,
      created_at: new Date()
    });

    this.replyTexts[post.id] = '';
    this.replyInputs[post.id] = false;
  }
}
