import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EnviromentsPageRoutingModule } from './enviroments-routing.module';

import { EnviromentsPage } from './enviroments.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    EnviromentsPageRoutingModule
  ],
  declarations: [EnviromentsPage]
})
export class EnviromentsPageModule {}
