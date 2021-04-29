import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './shared/services/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'environments',
    pathMatch: 'full'
  },
  {
    path: 'folder/:id',
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  },
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
    path: 'modules',
    loadChildren: () => import('./pages/init/modules/modules.module').then( m => m.ModulesPageModule),
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
