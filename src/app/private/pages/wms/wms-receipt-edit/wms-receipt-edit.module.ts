import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WmsReceiptEditPageRoutingModule } from './wms-receipt-edit-routing.module';

import { WmsReceiptEditPage } from './wms-receipt-edit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WmsReceiptEditPageRoutingModule
  ],
  declarations: [WmsReceiptEditPage]
})
export class WmsReceiptEditPageModule {}
