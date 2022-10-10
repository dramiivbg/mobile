import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PhysicalIntentoryPage } from './physical-intentory.page';

const routes: Routes = [
  {
    path: '',
    component: PhysicalIntentoryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PhysicalIntentoryPageRoutingModule {}
