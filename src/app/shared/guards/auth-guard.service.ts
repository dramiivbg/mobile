import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { SK_AUTHORIZE_ACCESS_CLIENT, SK_USER_SESSION,  } from '@var/consts';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  private authorizeAccessClient: any;
  private login: any = {};

  constructor(
    private router: Router,
    private storage: Storage
    ) {   }

  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    this.authorizeAccessClient = await this.storage.get(SK_AUTHORIZE_ACCESS_CLIENT);
    this.login = JSON.parse(await this.storage.get(SK_USER_SESSION));

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
    if (this.login !== undefined && this.login !== null){
      this.router.navigateByUrl('', { replaceUrl: true });
      return false;
    } else {
      if (this.authorizeAccessClient === undefined || this.authorizeAccessClient === null){
        this.router.navigate(["environments"]);
        return false;
      }
    }
    return true;
  }

  isChangePassword() : boolean {
    if (!this.login.temporaryPassword){
      this.router.navigateByUrl('', { replaceUrl: true });
      return false;
    }

    return true;
  }

  isDefault() : boolean {
    if (this.login === undefined || this.login === null){
      this.router.navigate(["environments"]);
      return false;
    }
    else {
      try {
        if(this.login.temporaryPassword)
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