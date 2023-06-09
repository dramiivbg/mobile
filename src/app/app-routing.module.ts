import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '@guard/auth-guard.service';

const routes: Routes = [
  { path: '', loadChildren: () => import('./public/public.module').then( m => m.PublicModule), canActivate: [AuthGuardService] },
  { path: 'page', loadChildren: () => import('./private/private.module').then( m => m.PrivateModule), canActivate: [AuthGuardService] }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, relativeLinkResolution: 'legacy' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
