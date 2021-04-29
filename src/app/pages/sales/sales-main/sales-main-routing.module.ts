import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SalesMainPage } from './sales-main.page';

const routes: Routes = [
  {
    path: '',
    component: SalesMainPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalesMainPageRoutingModule {}
