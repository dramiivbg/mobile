import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaymentMainPageRoutingModule } from './payment-main-routing.module';

import { PaymentMainPage } from './payment-main.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PaymentMainPageRoutingModule
  ],
  declarations: [PaymentMainPage]
})
export class PaymentMainPageModule {}
