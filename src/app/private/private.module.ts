import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrivateRoutingModule } from './private-routing.module';
import { IonicModule } from '@ionic/angular';
import { PrivateComponent } from './private.component';
import { SharedModule } from '../shared/modules/sharedModule.module';
import { MainPageModule } from './pages/main/main.module';
import { SalesService } from '@svc/Sales.service';
import { PopoverLpEditComponent } from './components/popover-lp-edit/popover-lp-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchComponent } from './components/search/search.component';



@NgModule({
  declarations: [
    PrivateComponent,
  
    
  ],
  imports: [
    CommonModule,
    IonicModule,
    PrivateRoutingModule,
    SharedModule,
    MainPageModule,
    FormsModule,
    ReactiveFormsModule,


  ],
  providers: [
    SalesService
  ]
})
export class PrivateModule { }
