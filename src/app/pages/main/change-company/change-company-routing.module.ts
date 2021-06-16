import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChangeCompanyPage } from './change-company.page';

const routes: Routes = [
  {
    path: '',
    component: ChangeCompanyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChangeCompanyPageRoutingModule {}
