import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WmsRoutingModule } from './wms-routing.module';
import { SharedModule } from 'src/app/shared/modules/sharedModule.module';
import { IonicModule, ModalController, PopoverController } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WmsMainPage } from './wms-main/wms-main.page';
import { WmsComponent } from './wms.component';
import { WmsReceiptPage } from './wms-receipt/wms-receipt.page';
import { SearchComponent } from '@prv/components/search/search.component';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { PopoverOptionsComponent } from '@prv/components/popover-options/popover-options.component';
import { LicensePlatesComponent } from './license-plates/license-plates.component';
import { PopoverLpsComponent} from '../../components/popover-lps/popover-lps.component';
import {AlertController} from '@ionic/angular';
import { EditPutAwayComponent } from '../../components/edit-put-away/edit-put-away.component';
import { PopoverNewPalletComponent } from '@prv/components/popover-new-pallet/popover-new-pallet.component';
import { ListPalletComponent } from '@prv/components/list-pallet/list-pallet.component';

import { ListPItemsComponent } from '@prv/components/list-pitems/list-pitems.component';


import { AlertsComponent } from 'src/app/components/alerts/alerts.component';
import { PhysicalIntentoryPage } from './physical-intentory/physical-intentory.page';
import { WmsMovementPage } from './wms-movement/wms-movement.page';
import { WmsItemJournalPage } from './wms-item-journal/wms-item-journal.page';
import { WhitemReclassificationPage } from './whitem-reclassification/whitem-reclassification.page';
import { PopoverLpEmptyComponent } from '@prv/components/popover-lp-empty/popover-lp-empty.component';
import { WmsSplitMergePage } from './wms-split-merge/wms-split-merge.page';
import { PopoverMergeComponent } from '@prv/components/popover-merge/popover-merge.component';
import { PopoverSplitComponent } from '@prv/components/popover-split/popover-split.component';
import { PopoverOpionsLpComponent } from '@prv/components/popover-opions-lp/popover-opions-lp.component';
import { PopoverLpEditComponent } from '@prv/components/popover-lp-edit/popover-lp-edit.component';
import { ReadLicensePlateComponent } from '@prv/components/read-license-plate/read-license-plate.component';
import { ReadBinContentComponent } from '@prv/components/read-bin-content/read-bin-content.component';
import { PopoverLogLpComponent } from '@prv/components/popover-log-lp/popover-log-lp.component';






@NgModule({
  declarations: [
    WmsComponent,
    WmsMainPage,
    WmsReceiptPage,
    PopoverOptionsComponent,
    LicensePlatesComponent,
    PopoverLpsComponent,
    PopoverNewPalletComponent,
    ListPalletComponent,
    ListPItemsComponent,
  
    PhysicalIntentoryPage,
    WmsMovementPage,
    WmsItemJournalPage,
    WhitemReclassificationPage,
    PopoverLpEmptyComponent,
    PopoverLpEmptyComponent,
    WmsSplitMergePage,
    EditPutAwayComponent,
    PopoverMergeComponent,
    PopoverSplitComponent,
    PopoverOpionsLpComponent,
    PopoverLpEditComponent,
    ReadLicensePlateComponent,
    ReadBinContentComponent,
    PopoverLogLpComponent
   
    
  
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    WmsRoutingModule,
    SharedModule,
    
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    BarcodeScanner,
    AlertController
  ],
  entryComponents: [
    PopoverOptionsComponent,
    LicensePlatesComponent,
    PopoverLpsComponent,
    EditPutAwayComponent,
    PopoverLpEmptyComponent,
    PopoverMergeComponent,
    PopoverSplitComponent,
    PopoverOpionsLpComponent,
    ReadLicensePlateComponent,
    ReadBinContentComponent,
    PopoverLogLpComponent
  
  ]
})
export class WmsModule { }
