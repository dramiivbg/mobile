import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PaymentMainPage } from './payment-main/payment-main.page';
import { PaymentsComponent } from './payments.component';

const routes: Routes = [
  { path: '', component: PaymentsComponent, children: [
    { path: '', redirectTo: 'paymentMain', pathMatch: 'full' },
    { path: 'paymentMain', component: PaymentMainPage },
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentsRoutingModule { }
