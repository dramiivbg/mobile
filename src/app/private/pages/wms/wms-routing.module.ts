import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WmsMainPage } from './wms-main/wms-main.page';
import { WmsReceiptPage } from './wms-receipt/wms-receipt.page';
import { WmsComponent } from './wms.component';


const routes: Routes = [
  { path: '', component: WmsComponent, children: [
    { path: '', redirectTo: 'wmsMain', pathMatch: 'full' },
    { path: 'wmsMain', component: WmsMainPage },
    { path: 'wmsReceipt', component: WmsReceiptPage }
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WmsRoutingModule { }
