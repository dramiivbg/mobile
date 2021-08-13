import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SalesMainPageRoutingModule } from './sales-main-routing.module';

import { SalesMainPage } from './sales-main.page';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { SharedModule } from 'src/app/shared/modules/sharedModule.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SalesMainPageRoutingModule,
    SharedModule
  ],
  declarations: [SalesMainPage]
})
export class SalesMainPageModule {}
