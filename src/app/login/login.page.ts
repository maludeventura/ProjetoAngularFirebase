import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../shared/api.service';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
})
export class LoginPage {
  usuario: any = {
    email: '',
    password: '',
  };

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  // Cadastro de usuário
  cadastrarUsuario() {
    this.apiService.post('usuario/registrar-se', this.usuario).subscribe({

      next: (resp: any) => {
        console.log(resp);
        alert('Usuário registrado! Agora faça login.');
      },

      error: (err) => console.error('Erro ao registrar:', err)
    });
  }

  // Login do usuário
  loginUsuario() {
    this.apiService.post('usuario/login', {
      email: this.usuario.email,
      password: this.usuario.password
    })

    .subscribe({
      next: (resp: any) => {
        console.log(resp);
        localStorage.setItem('token', resp.token);
        this.router.navigate(['/home']);
      },

      error: (err) => {
        console.error('Erro no login:', err);
        alert('Credenciais inválidas');
      }
    });
  }
}
