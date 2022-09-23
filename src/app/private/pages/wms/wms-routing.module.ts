import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PopoverNewPalletComponent } from '@prv/components/popover-new-pallet/popover-new-pallet.component';
import { WmsMainPage } from './wms-main/wms-main.page';
import { WmsReceiptEditPage } from './wms-receipt-edit/wms-receipt-edit.page';

import { WmsReceiptPage } from './wms-receipt/wms-receipt.page';
import { WmsComponent } from './wms.component';


const routes: Routes = [
  { path: '', component: WmsComponent, children: [
    { path: '', redirectTo: 'wmsMain', pathMatch: 'full' },
    { path: 'wmsMain', component: WmsMainPage },
    { path: 'wmsReceipt', component: WmsReceiptPage },
    {path: 'wmsReceiptEdit', component: WmsReceiptEditPage},
   
    {path: 'newPallet', component: PopoverNewPalletComponent},
   
  ]},


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WmsRoutingModule { }
