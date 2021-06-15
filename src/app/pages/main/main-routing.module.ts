import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainPage } from './main.page';

const routes: Routes = [
  {
    path: 'main',
    component: MainPage
    ,
    children: [
      {
        path: 'modules',
        loadChildren: () => import('./modules/modules.module').then( m => m.ModulesPageModule)
      },
      {
        path: 'settings',
        loadChildren: () => import('./settings/settings.module').then( m => m.SettingsPageModule)
      },
      {
        path: 'init/sync',
        loadChildren: () => import('../../pages/init/sync/sync.module').then( m => m.SyncPageModule)
      },
      {
        path: 'change-company',
        loadChildren: () => import('./change-company/change-company.module').then( m => m.ChangeCompanyPageModule)
      }
    ]
  },
  {
    path: '',
    redirectTo: '/main/modules'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainPageRoutingModule {}
