import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostedPage } from './posted/posted.page';
import { SalesFormPage } from './sales-form/sales-form.page';
import { SalesMainPage } from './sales-main/sales-main.page';
import { SalesPagePage } from './sales-page/sales-page.page';
import { SalesComponent } from './sales.component';

const routes: Routes = [
  { path: '', component: SalesComponent, children: [
    { path: '', redirectTo: 'main', pathMatch: 'full' },
    { path: 'main', component: SalesMainPage },
    { path: 'page', component: SalesPagePage },
    { path: 'form', component: SalesFormPage },
    { path: 'posted', component: PostedPage }
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesRoutingModule { }
