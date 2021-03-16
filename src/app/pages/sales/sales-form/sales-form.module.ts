import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SalesFormPageRoutingModule } from './sales-form-routing.module';
import { SalesFormPage } from './sales-form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SalesFormPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [SalesFormPage]
})
export class SalesFormPageModule {}
