import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { SK_AUTHORIZE_ACCESS_CLIENT, SK_USER_SESSION,  } from '@var/consts';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  private authorizeAccessClient: any;
  private login: string;

  constructor(
    private router: Router,
    private storage: Storage
    ) {   }

  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    this.authorizeAccessClient = await this.storage.get(SK_AUTHORIZE_ACCESS_CLIENT);
    this.login = await this.storage.get(SK_USER_SESSION);

    console.log(route.routeConfig.path);

    switch(route.routeConfig.path) {
      case 'environments':
        return this.isEnvironments();
      case 'login':
        return this.isLogin();
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

  isDefault() : boolean {
    if (this.login === undefined || this.login === null){
      this.router.navigate(["environments"]);
      return false;
    }
    return true;
  }

}