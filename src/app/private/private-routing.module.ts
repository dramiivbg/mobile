import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainPage } from './pages/main/main.page';
import { PrivateComponent } from './private.component';

const routes: Routes = [
  { path: '', component: PrivateComponent, children: [
    { path: '', redirectTo: 'main', pathMatch: 'full' },
    { path: 'main', loadChildren: () => import('./pages/main/main.module').then(m => m.MainPageModule) },
    { path: 'sales', loadChildren: () => import('./pages/sales/sales.module').then(m => m.SalesModule) }
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrivateRoutingModule { }
