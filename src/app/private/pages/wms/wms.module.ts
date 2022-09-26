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
import { WmsReceiptEditPage } from './wms-receipt-edit/wms-receipt-edit.page';
import { PopoverNewPalletComponent } from '@prv/components/popover-new-pallet/popover-new-pallet.component';
import { ListPalletComponent } from '@prv/components/list-pallet/list-pallet.component';

import { ListPItemsComponent } from '@prv/components/list-pitems/list-pitems.component';





@NgModule({
  declarations: [
    WmsComponent,
    WmsMainPage,
    WmsReceiptPage,
    SearchComponent,
    PopoverOptionsComponent,
    LicensePlatesComponent,
    PopoverLpsComponent,
    WmsReceiptEditPage,
    PopoverNewPalletComponent,
    ListPalletComponent,
    ListPItemsComponent
   
    
  
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    WmsRoutingModule,
    SharedModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    BarcodeScanner,
    AlertController
  ],
  entryComponents: [
    PopoverOptionsComponent,
    LicensePlatesComponent,
    PopoverLpsComponent
  ]
})
export class WmsModule { }
