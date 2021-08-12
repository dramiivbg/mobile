import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChangePasswordPageRoutingModule } from './change-password-routing.module';

import { ChangePasswordPage } from './change-password.page';
import { SharedModule } from 'src/app/shared/modules/sharedModule.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChangePasswordPageRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [ChangePasswordPage]
})
export class ChangePasswordPageModule {}
