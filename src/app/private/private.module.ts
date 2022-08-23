import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrivateRoutingModule } from './private-routing.module';
import { IonicModule } from '@ionic/angular';
import { PrivateComponent } from './private.component';
import { SharedModule } from '../shared/modules/sharedModule.module';
import { MainPageModule } from './pages/main/main.module';
import { SalesService } from '@svc/Sales.service';


@NgModule({
  declarations: [
    PrivateComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    PrivateRoutingModule,
    SharedModule,
    MainPageModule
  ],
  providers: [
    SalesService
  ]
})
export class PrivateModule { }