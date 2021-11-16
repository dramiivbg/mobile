import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentsRoutingModule } from './payments-routing.module';
import { PaymentsComponent } from './payments.component';
import { PaymentMainPage } from './payment-main/payment-main.page';
import { SharedModule } from 'src/app/shared/modules/sharedModule.module';
import { IonicModule } from '@ionic/angular';
import { PostedPage } from './posted/posted.page';
import { StripePayComponent } from '@prv/components/stripe-pay/stripe-pay.component';
import { PaymentsMadePage } from './payments-made/payments-made.page';


@NgModule({
  declarations: [
    PaymentsComponent,
    PaymentMainPage,
    PostedPage,
    PaymentsMadePage,
    StripePayComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    PaymentsRoutingModule,
    SharedModule
  ]
})
export class PaymentsModule { }
