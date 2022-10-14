import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListPalletComponent } from '@prv/components/list-pallet/list-pallet.component';

import { PopoverNewPalletComponent } from '@prv/components/popover-new-pallet/popover-new-pallet.component';
import { WmsMainPage } from './wms-main/wms-main.page';


import { WmsReceiptPage } from './wms-receipt/wms-receipt.page';
import { WmsComponent } from './wms.component';
import { ListPItemsComponent } from '@prv/components/list-pitems/list-pitems.component';
import { AddItemOrLpComponent } from '@prv/components/add-item-or-lp/add-item-or-lp.component';
import { PhysicalIntentoryPage } from './physical-intentory/physical-intentory.page';
import { WmsMovementPage } from './wms-movement/wms-movement.page';
import { WmsItemJournalPage } from './wms-item-journal/wms-item-journal.page';
import { WhitemReclassificationPage } from './whitem-reclassification/whitem-reclassification.page';
import { WmsSplitMergePage } from './wms-split-merge/wms-split-merge.page';




const routes: Routes = [
  {
    path: '', component: WmsComponent, children: [
      { path: '', redirectTo: 'wmsMain', pathMatch: 'full' },
      { path: 'wmsMain', component: WmsMainPage },
      { path: 'wmsReceipt', component: WmsReceiptPage },
      { path: 'physical-inventory', component: PhysicalIntentoryPage },

      { path: 'newPallet', component: PopoverNewPalletComponent },
      { path: 'listPallet', component: ListPalletComponent },
      { path: 'lists', component: ListPItemsComponent },
      { path: 'AddLists', component: AddItemOrLpComponent },
      { path: 'wmsMovement', component: WmsMovementPage },

      { path: 'wmsItemJournal', component: WmsItemJournalPage },

      {path: 'whItemReclassification', component: WhitemReclassificationPage  },
  
    {path: 'newPallet', component: PopoverNewPalletComponent},
    {path: 'listPallet', component: ListPalletComponent},
    {path: 'lists', component: ListPItemsComponent},
    {path: 'AddLists', component:  AddItemOrLpComponent},
    {path: 'wmsMovement', component: WmsMovementPage},
   
    {path: 'wmsItemJournal',component: WmsItemJournalPage},

    {path: 'wmsSplitMerge', component: WmsSplitMergePage},
  ]
},
,
  

 




];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WmsRoutingModule { }
