import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SalesPagePage } from './sales-page.page';

const routes: Routes = [
  {
    path: '',
    component: SalesPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalesPagePageRoutingModule {}
