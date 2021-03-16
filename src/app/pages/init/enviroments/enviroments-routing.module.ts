import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EnviromentsPage } from './enviroments.page';

const routes: Routes = [
  {
    path: '',
    component: EnviromentsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EnviromentsPageRoutingModule {}
