import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WmsReceiptEditPage } from './wms-receipt-edit.page';

const routes: Routes = [
  {
    path: '',
    component: WmsReceiptEditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WmsReceiptEditPageRoutingModule {}
