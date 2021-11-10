import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaymentMainPage } from './payment-main.page';

const routes: Routes = [
  {
    path: '',
    component: PaymentMainPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentMainPageRoutingModule {}
