import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SalesFormPageRoutingModule } from './sales-form-routing.module';
import { SalesFormPage } from './sales-form.page';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { SharedModule } from 'src/app/shared/modules/sharedModule.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SalesFormPageRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [SalesFormPage]
})
export class SalesFormPageModule {}
