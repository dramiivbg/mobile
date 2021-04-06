import { templateJitUrl } from '@angular/compiler';
import { convertActionBinding } from '@angular/compiler/src/compiler_util/expression_converter';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { CONNREFUSED } from 'dns';
import { promise } from 'selenium-webdriver';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  private customerId: String;
  private login: String;

  constructor(
    private router: Router,
    private storage: Storage
    ) {   }

  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    this.customerId = await this.storage.get('SESSION_CUSTOMER_ID');
    this.login = await this.storage.get('SESSION_LOGIN');

    switch(route.routeConfig.path){
      case 'environments':
        return this.isEnvironments();
      case 'login':
        return this.isLogin();
      default:
        return this.isDefault();
    }
  }

  isEnvironments() : boolean {
    if (this.customerId !== undefined && this.customerId !== null){
      this.router.navigate(["login"]);
      return false;
    }
    return true;
  }

  isLogin() : boolean {

    if (this.login !== undefined && this.login !== null){
      this.router.navigate(["init/home"]);
      return false;
    } else {
      if (this.customerId === undefined || this.customerId === null){
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