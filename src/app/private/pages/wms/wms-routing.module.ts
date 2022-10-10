import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListPalletComponent } from '@prv/components/list-pallet/list-pallet.component';

import { PopoverNewPalletComponent } from '@prv/components/popover-new-pallet/popover-new-pallet.component';
import { WmsMainPage } from './wms-main/wms-main.page';


import { WmsReceiptPage } from './wms-receipt/wms-receipt.page';
import { WmsComponent } from './wms.component';
import { ListPItemsComponent } from '@prv/components/list-pitems/list-pitems.component';
import { AddItemOrLpComponent} from '@prv/components/add-item-or-lp/add-item-or-lp.component';




const routes: Routes = [
  { path: '', component: WmsComponent, children: [
    { path: '', redirectTo: 'wmsMain', pathMatch: 'full' },
    { path: 'wmsMain', component: WmsMainPage },
    { path: 'wmsReceipt', component: WmsReceiptPage },
    
   
    {path: 'newPallet', component: PopoverNewPalletComponent},
    {path: 'listPallet', component: ListPalletComponent},
    {path: 'lists', component: ListPItemsComponent},
    {path: 'AddLists', component:  AddItemOrLpComponent}
   
  ]},


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WmsRoutingModule { }
