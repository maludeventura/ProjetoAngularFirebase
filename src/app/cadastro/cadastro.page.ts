import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ApiService } from '../shared/api.service';
import { ToastController } from '@ionic/angular';

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
    private alertCtrl: AlertController,
    private toastController: ToastController
  ) {}
  

  cadastrarUsuario() {
    this.apiService.post('usuario/registrar-se', this.usuario).subscribe({
      next: async (resp) => {
        console.log(resp);

        const toast = await this.toastController.create({
          message: '🎉 Cadastro realizado com sucesso!',
          duration: 5000, 
          position: 'top',
          color: 'success',
          animated: true
        });
        
        await toast.present();
        
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
        
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

