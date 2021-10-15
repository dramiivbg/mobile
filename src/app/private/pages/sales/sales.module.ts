import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalesRoutingModule } from './sales-routing.module';
import { SalesMainPage } from './sales-main/sales-main.page';
import { SalesComponent } from './sales.component';
import { SalesPagePage } from './sales-page/sales-page.page';
import { SalesFormPage } from './sales-form/sales-form.page';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/shared/modules/sharedModule.module';


@NgModule({
  declarations: [
    SalesComponent,
    SalesMainPage,
    SalesPagePage,
    SalesFormPage
  ],
  imports: [
    CommonModule,
    IonicModule,
    SalesRoutingModule,
    SharedModule
  ]
})
export class SalesModule { }
