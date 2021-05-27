import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '@guard/auth-guard.service';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./pages/init/login/login.module').then( m => m.LoginPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'init/home',
    loadChildren: () => import('./pages/init/home/home.module').then( m => m.HomePageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'init/sync',
    loadChildren: () => import('./pages/init/sync/sync.module').then( m => m.SyncPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'sales/sales-main',
    loadChildren: () => import('./pages/sales/sales-main/sales-main.module').then( m => m.SalesMainPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'sales/sales-page',
    loadChildren: () => import('./pages/sales/sales-page/sales-page.module').then( m => m.SalesPagePageModule)
  },
  {
    path: 'sales/sales-form',
    loadChildren: () => import('./pages/sales/sales-form/sales-form.module').then( m => m.SalesFormPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'environments',
    loadChildren: () => import('./pages/init/environments/environments.module').then( m => m.EnvironmentsPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: '',
    loadChildren: () => import('./pages/main/main.module').then( m => m.MainPageModule),
    canActivate: [AuthGuardService]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
