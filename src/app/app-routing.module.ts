import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'enviroments',
    pathMatch: 'full'
  },
  {
    path: 'folder/:id',
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/init/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'init/home',
    loadChildren: () => import('./pages/init/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'sales/sales-form',
    loadChildren: () => import('./pages/sales/sales-form/sales-form.module').then( m => m.SalesFormPageModule)
  },
  {
    path: 'enviroments',
    loadChildren: () => import('./pages/init/enviroments/enviroments.module').then( m => m.EnviromentsPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
