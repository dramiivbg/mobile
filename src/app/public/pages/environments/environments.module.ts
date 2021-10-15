import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EnviromentsPageRoutingModule } from './environments-routing.module';

import { EnvironmentsPage } from './environments.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    EnviromentsPageRoutingModule
  ],
  declarations: [EnvironmentsPage]
})
export class EnvironmentsPageModule {}
