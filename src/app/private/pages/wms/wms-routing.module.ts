import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListPalletComponent } from '@prv/components/list-pallet/list-pallet.component';

import { PopoverNewPalletComponent } from '@prv/components/popover-new-pallet/popover-new-pallet.component';
import { WmsMainPage } from './wms-main/wms-main.page';


import { WmsReceiptPage } from './wms-receipt/wms-receipt.page';
import { WmsComponent } from './wms.component';
import { ListPItemsComponent } from '@prv/components/list-pitems/list-pitems.component';
import { WmsMovementPage } from './wms-movement/wms-movement.page';
import { WmsItemJournalPage } from './wms-item-journal/wms-item-journal.page';
import { WhitemReclassificationPage } from './whitem-reclassification/whitem-reclassification.page';
import { WmsSplitMergePage } from './wms-split-merge/wms-split-merge.page';

import { BinToBinPage } from './bin-to-bin/bin-to-bin.page';
import { EditPutAwayComponent } from '@prv/components/edit-put-away/edit-put-away.component';
import { PhysicalInventoryPage } from './physical-inventory/physical-inventory.page';
import { PhysicalCountComponent } from '@prv/components/physical-count/physical-count.component';
import { PhysicalNoCountComponent } from '@prv/components/physical-no-count/physical-no-count.component';
import { PagueInquiriesComponent } from '@prv/components/pague-inquiries/pague-inquiries.component';




const routes: Routes = [
  {
    path: '', component: WmsComponent, children: [
      { path: '', redirectTo: 'wmsMain', pathMatch: 'full' },
      { path: 'wmsMain', component: WmsMainPage },
      { path: 'wmsReceipt', component: WmsReceiptPage },

      { path: 'newPallet', component: PopoverNewPalletComponent },
      { path: 'listPallet', component: ListPalletComponent },
      { path: 'lists', component: ListPItemsComponent },
      { path: 'wmsMovement', component: WmsMovementPage },

      {path: 'wmsPutAway', component: EditPutAwayComponent},

      { path: 'wmsItemJournal', component: WmsItemJournalPage },

      {path: 'whItemReclassification', component: WhitemReclassificationPage  },
  
    {path: 'newPallet', component: PopoverNewPalletComponent},
    {path: 'listPallet', component: ListPalletComponent},
    {path: 'lists', component: ListPItemsComponent},

    {path: 'wmsMovement', component: WmsMovementPage},
   
    {path: 'wmsItemJournal',component: WmsItemJournalPage},

    {path: 'wmsSplitMerge', component: WmsSplitMergePage},

    {path: 'Inquiries', component: PagueInquiriesComponent },


    {path: 'binToBin', component: BinToBinPage},

    {path: 'physicalInventory', component: PhysicalInventoryPage},
    {path: 'physicalCount', component: PhysicalCountComponent},
    {path: 'physicalNoCount', component: PhysicalNoCountComponent}
  ]
},



  

 




];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WmsRoutingModule { }
