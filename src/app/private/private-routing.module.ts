import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainPage } from './pages/main/main.page';
import { PrivateComponent } from './private.component';

const routes: Routes = [
  { path: '', component: PrivateComponent, children: [
    { path: 'main', loadChildren: () => import('./pages/main/main.module').then(m => m.MainPageModule) },
    { path: 'sales', loadChildren: () => import('./pages/sales/sales.module').then(m => m.SalesModule) },
    { path: 'payments', loadChildren: () => import('./pages/payments/payments.module').then( m => m.PaymentsModule ) },
    { path: 'wms', loadChildren: () => import('./pages/wms/wms.module').then(m => m.WmsModule) },
    { path: '', redirectTo: 'main', pathMatch: 'full' }
  ]},
 

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrivateRoutingModule { }
