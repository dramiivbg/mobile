import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentsRoutingModule } from './payments-routing.module';
import { PaymentsComponent } from './payments.component';
import { PaymentMainPage } from './payment-main/payment-main.page';
import { SharedModule } from 'src/app/shared/modules/sharedModule.module';
import { IonicModule } from '@ionic/angular';


@NgModule({
  declarations: [
    PaymentsComponent,
    PaymentMainPage
  ],
  imports: [
    CommonModule,
    IonicModule,
    PaymentsRoutingModule,
    SharedModule
  ]
})
export class PaymentsModule { }
