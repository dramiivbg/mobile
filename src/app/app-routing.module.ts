import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '@guard/auth-guard.service';

const routes: Routes = [
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
    loadChildren: () => import('./pages/main/modules/modules.module').then( m => m.ModulesPageModule),
    canActivate: [AuthGuardService]    
  },
  {
    path: 'sales/sales-main',
    loadChildren: () => import('./pages/sales/sales-main/sales-main.module').then( m => m.SalesMainPageModule)
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
