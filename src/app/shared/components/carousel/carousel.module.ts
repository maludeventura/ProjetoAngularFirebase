import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { CarouselComponent } from './carousel.component';



@NgModule({
  declarations: [
    CarouselComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
  ],
  exports: [
    CarouselComponent
  ]
})
export class CarouselModule { }
