import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { AuthService } from '@svc/auth.service';
import { SK_AUTHORIZE_ACCESS_CLIENT, SK_USER_SESSION,  } from '@var/consts';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  private authorizeAccessClient: any;
  private userSession: any = {};

  constructor(private router: Router,
    private storage: Storage,
    private authService: AuthService) { }

  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    this.authorizeAccessClient = await this.storage.get(SK_AUTHORIZE_ACCESS_CLIENT);
    await this.authService.getUserSession().then(
      res => this.userSession = res
    );

    switch(route.routeConfig.path) {
      case 'environments':
        return this.isEnvironments();
      case 'login':
        return this.isLogin();
      case 'change-password':
        return this.isChangePassword();
      default:
        return this.isDefault();
    }
  }

  isEnvironments() : boolean {
    if (this.authorizeAccessClient !== undefined && this.authorizeAccessClient !== null){
      this.router.navigate(["login"]);
      return false;
    }
    return true;
  }

  isLogin() : boolean {
    if (this.userSession !== undefined && this.userSession !== null){
      this.router.navigateByUrl('', { replaceUrl: true });
      return false;
    } /*else {
      if (this.authorizeAccessClient === undefined || this.authorizeAccessClient === null){
        this.router.navigate(["environments"]);
        return false;
      }
    }*/
    return true;
  }

  isChangePassword() : boolean {
    if (this.userSession !== undefined && this.userSession !== null && !this.userSession.temporaryPassword){
      this.router.navigateByUrl('', { replaceUrl: true });
      return false;
    }

    return true;
  }

  isDefault() : boolean {
    if (this.userSession === undefined || this.userSession === null){
      this.router.navigate(["login"]);
      return false;
    }
    else {
      try {
        if(this.userSession.temporaryPassword)
        {
          this.router.navigate(["change-password"]);
          return false;
        }
      } catch (error) {
        return true;
      }
    }

    return true;
  }

}