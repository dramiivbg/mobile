import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { JwtHelperService} from '@auth0/angular-jwt';

// import vars
import { SK_REMEMBER_ME, SK_SELECTED_COMPANY, SK_USER_LOGIN, SK_USER_SESSION } from '@var/consts';
import { BehaviorSubject } from 'rxjs';

const helper = new JwtHelperService();

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);  
  private userSession: any = {};

  constructor(private storage: Storage) { 
    this.checkUserSession();
  }

  checkUserSession() {
    this.storage.get(SK_USER_SESSION)
    .then(res => {
      this.userSession = JSON.parse(res)
      if(this.checkToken(this.userSession.token)) {
        this.signout();
      }
      else {
        this.isAuthenticated.next(true);
      }
    })
    .finally(() => this.isAuthenticated.next(false));        
  }

  private checkToken(token: string) : boolean {    
    const isExpired = helper.isTokenExpired(token);
    return isExpired;
  }  

  saveUserSession(userSession: any): void {
    this.isAuthenticated.next(true);
    this.storage.set(SK_USER_SESSION, JSON.stringify(userSession));
    this.storage.set(SK_SELECTED_COMPANY, JSON.stringify(userSession.defaultCompany));
  }

  async getUserSession(): Promise<any> {
    return this.storage.get(SK_USER_SESSION).then(res => this.userSession = JSON.parse(res));
  }

  async signout(): Promise<any> {
    this.isAuthenticated.next(false);
    return this.storage.remove(SK_USER_SESSION);    
  }
}
