import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChangeInstancePageRoutingModule } from './change-instance-routing.module';

import { ChangeInstancePage } from './change-instance.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChangeInstancePageRoutingModule
  ],
  declarations: [ChangeInstancePage]
})
export class ChangeInstancePageModule {}
