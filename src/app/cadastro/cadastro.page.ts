import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ApiService } from '../shared/api.service';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
})
export class CadastroPage {
  usuario: any = {
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  }

  constructor(
    public apiService: ApiService,
    private router: Router,
    private alertCtrl: AlertController
  ) {}

  cadastrarUsuario() {
    this.apiService.post('usuario/registrar-se', this.usuario).subscribe({
      next: async (resp) => {
        console.log(resp);

        const alert = await this.alertCtrl.create({
          header: 'Sucesso 🎉',
          message: 'Cadastrado com sucesso!',
          buttons: ['OK']
        });

        await alert.present();

        alert.onDidDismiss().then(() => {
          this.router.navigate(['/login']);
        });
      },
      error: async (err) => {
        console.error(err);

        const alert = await this.alertCtrl.create({
          header: 'Erro 😢',
          message: 'Não foi possível cadastrar, verifique os dados.',
          buttons: ['OK']
        });

        await alert.present();
      }
    });
  }
}

