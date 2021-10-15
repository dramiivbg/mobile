import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '@guard/auth-guard.service';

const routes: Routes = [
  // {
  //   path: 'login',
  //   loadChildren: () => import('./public/pages/login/login.module').then( m => m.LoginPageModule),
  //   canActivate: [AuthGuardService]
  // },
  // { path: '', loadChildren: () => import('./private/pages/').then( m => m.SyncPageModule), canActivate: [AuthGuardService] },
  { path: '', loadChildren: () => import('./public/public.module').then( m => m.PublicModule), canActivate: [AuthGuardService] },
  { path: 'page', loadChildren: () => import('./private/private.module').then( m => m.PrivateModule), canActivate: [AuthGuardService] },
  { path: 'init/sync', loadChildren: () => import('./private/pages/main/sync/sync.module').then( m => m.SyncPageModule), canActivate: [AuthGuardService] },
  // { path: '', loadChildren: () => import('./public/pages/sync/sync.module').then( m => m.SyncPageModule), canActivate: [AuthGuardService] },
  {
    path: 'sales/sales-main',
    loadChildren: () => import('./private/pages/sales/sales-main/sales-main.module').then( m => m.SalesMainPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'sales/sales-page',
    loadChildren: () => import('./private/pages/sales/sales-page/sales-page.module').then( m => m.SalesPagePageModule)
  },
  {
    path: 'sales/sales-form',
    loadChildren: () => import('./private/pages/sales/sales-form/sales-form.module').then( m => m.SalesFormPageModule),
    canActivate: [AuthGuardService]
  },
  // {
  //   path: 'environments',
  //   loadChildren: () => import('./public/pages/environments/environments.module').then( m => m.EnvironmentsPageModule),
  //   canActivate: [AuthGuardService]
  // },
  // {
  //   path: 'change-password',
  //   loadChildren: () => import('./public/pages/change-password/change-password.module').then( m => m.ChangePasswordPageModule),
  //   canActivate: [AuthGuardService]
  // },
  // {
  //   path: '',
  //   loadChildren: () => import('./private/pages/main/main.module').then( m => m.MainPageModule),
  //   canActivate: [AuthGuardService]
  // },
  {
    path: 'change-instance',
    loadChildren: () => import('./public/pages/change-instance/change-instance.module').then( m => m.ChangeInstancePageModule)
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
