import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalesRoutingModule } from './sales-routing.module';
import { SalesMainPage } from './sales-main/sales-main.page';
import { SalesComponent } from './sales.component';
import { SalesPagePage } from './sales-page/sales-page.page';
import { SalesFormPage } from './sales-form/sales-form.page';
import { IonicModule } from '@ionic/angular';


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
    SalesRoutingModule
  ]
})
export class SalesModule { }
