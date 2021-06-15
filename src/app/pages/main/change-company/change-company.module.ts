import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChangeCompanyPageRoutingModule } from './change-company-routing.module';

import { ChangeCompanyPage } from './change-company.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChangeCompanyPageRoutingModule
  ],
  declarations: [ChangeCompanyPage]
})
export class ChangeCompanyPageModule {}
