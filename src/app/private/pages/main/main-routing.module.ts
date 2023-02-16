import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainPage } from './main.page';

const routes: Routes = [
  { path: '', component: MainPage , children: [
    { path: '', redirectTo: 'modules' },
    { path: 'modules', loadChildren: () => import('./modules/modules.module').then( m => m.ModulesPageModule) },
    { path: 'settings', loadChildren: () => import('./settings/settings.module').then( m => m.SettingsPageModule) },
    { path: 'settings/profile', loadChildren: () => import('./settings/profile/profile.module').then( m => m.ProfilePageModule) },
    { path: 'settings/change-password', loadChildren: () => import('./settings/change-password/change-password.module').then( m => m.ChangePasswordPageModule) },
    { path: 'init/sync', loadChildren: () => import('./sync/sync.module').then( m => m.SyncPageModule) },
    { path: 'change-company', loadChildren: () => import('./change-company/change-company.module').then( m => m.ChangeCompanyPageModule) },
  
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainPageRoutingModule {}
