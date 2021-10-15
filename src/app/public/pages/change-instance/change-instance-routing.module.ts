import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChangeInstancePage } from './change-instance.page';

const routes: Routes = [
  {
    path: '',
    component: ChangeInstancePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChangeInstancePageRoutingModule {}
