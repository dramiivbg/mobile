import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SalesPagePageRoutingModule } from './sales-page-routing.module';

import { SalesPagePage } from './sales-page.page';
import { HeaderComponent } from '@prv/components/header/header.component';
import { SharedModule } from 'src/app/shared/modules/sharedModule.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SalesPagePageRoutingModule,
    SharedModule
  ],
  declarations: [SalesPagePage]
})
export class SalesPagePageModule {}
