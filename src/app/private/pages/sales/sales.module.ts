import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalesRoutingModule } from './sales-routing.module';
import { SalesMainPage } from './sales-main/sales-main.page';
import { SalesComponent } from './sales.component';
import { SalesPagePage } from './sales-page/sales-page.page';
import { SalesFormPage } from './sales-form/sales-form.page';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/shared/modules/sharedModule.module';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { SearchComponent } from '@prv/components/search/search.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { StripePayComponent } from '@prv/components/stripe-pay/stripe-pay.component';


@NgModule({
  declarations: [
    SalesComponent,
    SalesMainPage,
    SalesPagePage,
    SalesFormPage,
    SearchComponent,
    StripePayComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    SalesRoutingModule,
    SharedModule
  ],
  providers: [
    SplashScreen,
    BarcodeScanner
  ]
})
export class SalesModule { }
