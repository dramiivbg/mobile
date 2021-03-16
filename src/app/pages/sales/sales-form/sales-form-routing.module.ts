import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SalesFormPage } from './sales-form.page';

const routes: Routes = [
  {
    path: '',
    component: SalesFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalesFormPageRoutingModule {}
