import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChangeInstancePage } from './pages/change-instance/change-instance.page';
import { ChangePasswordPage } from './pages/change-password/change-password.page';
import { EnvironmentsPage } from './pages/environments/environments.page';
import { LoginPage } from './pages/login/login.page';
import { SyncPage } from '../private/pages/main/sync/sync.page';
import { PublicComponent } from './public.component';

const routes: Routes = [
  { path: '', component: PublicComponent, children: [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginPage },
    { path: 'change-password', component: ChangePasswordPage },
    { path: 'change-instance', component: ChangeInstancePage },
    { path: 'init/sync', component: SyncPage },
    { path: 'environments', component: EnvironmentsPage }
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
