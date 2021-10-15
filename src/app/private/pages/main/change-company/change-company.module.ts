import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChangeCompanyPageRoutingModule } from './change-company-routing.module';

import { ChangeCompanyPage } from './change-company.page';
import { SharedModule } from 'src/app/shared/modules/sharedModule.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChangeCompanyPageRoutingModule,
    SharedModule
  ],
  declarations: [ChangeCompanyPage]
})
export class ChangeCompanyPageModule {}
