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
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
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

  loginUsuario() {
    this.apiService.post('usuario/login', {
      email: this.usuario.email,
      password: this.usuario.password
    })
    .subscribe({
      next: (resp: any) => {
        console.log('Resposta do login:', JSON.stringify(resp, null, 2));

        localStorage.setItem('token', resp.token);
  
        // Ajuste isso conforme o formato do seu resp
        if (resp.user && resp.user.id) {
          localStorage.setItem('userId', resp.user.id.toString());
        } else if (resp.userId) {
          localStorage.setItem('userId', resp.userId.toString());
        } else {
          console.warn('userId não encontrado na resposta do login.');
        }
  
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Erro no login:', err);
        alert('Credenciais inválidas');
      }
    });
  }
  
}
