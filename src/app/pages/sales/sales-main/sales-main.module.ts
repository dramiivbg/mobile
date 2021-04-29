import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SalesMainPageRoutingModule } from './sales-main-routing.module';

import { SalesMainPage } from './sales-main.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SalesMainPageRoutingModule
  ],
  declarations: [SalesMainPage]
})
export class SalesMainPageModule {}
