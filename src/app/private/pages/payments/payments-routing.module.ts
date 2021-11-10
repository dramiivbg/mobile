import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PaymentMainPage } from './payment-main/payment-main.page';
import { PaymentsComponent } from './payments.component';
import { PostedPage } from './posted/posted.page';

const routes: Routes = [
  { path: '', component: PaymentsComponent, children: [
    { path: '', redirectTo: 'paymentMain', pathMatch: 'full' },
    { path: 'paymentMain', component: PaymentMainPage },
    { path: 'posted', component: PostedPage }
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentsRoutingModule { }
