import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { JwtHelperService} from '@auth0/angular-jwt';

// import vars
import { SK_REMEMBER_ME, SK_SELECTED_COMPANY, SK_SELECTED_MODULE, SK_SYNC, SK_USER_ID_OLD, SK_USER_SESSION } from '@var/consts';
import { BehaviorSubject } from 'rxjs';
import { OfflineService } from './offline.service';

const helper = new JwtHelperService();

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  private userSession: any = {};

  constructor(private storage: Storage
    , private offline: OfflineService
  ) {
    this.checkUserSession();
  }

  public checkUserSession() {
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

  public saveUserSession(userSession: any): boolean {
    this.userEquals(userSession);
    this.isAuthenticated.next(true);
    this.storage.set(SK_USER_SESSION, JSON.stringify(userSession));
    this.storage.set(SK_SELECTED_COMPANY, JSON.stringify(userSession.defaultCompany));
    this.storage.set(SK_SYNC, false);
    return true;
  }

  public async getUserSession(): Promise<any> {
    return this.storage.get(SK_USER_SESSION).then(res => this.userSession = JSON.parse(res));
  }

  public async signout(): Promise<any> {
    this.isAuthenticated.next(false);
    await this.storage.remove(SK_SELECTED_MODULE);
    await this.storage.remove(SK_SYNC);
    await this.offline.removeAll();
    return await this.storage.remove(SK_USER_SESSION);
  }

  public async signOutUserModify() {
    await this.setUserOld();
    this.isAuthenticated.next(false);
    await this.storage.remove(SK_SELECTED_MODULE);
    await this.storage.remove(SK_SYNC);
    return await this.storage.remove(SK_USER_SESSION);
  }

  private checkToken(token: string) : boolean {
    const isExpired = helper.isTokenExpired(token);
    return isExpired;
  }

  private async setUserOld() {
    let auth = await this.getUserSession()
    this.storage.set(SK_USER_ID_OLD, auth.userId);
  }

  private async getUserOld() {
    return await this.storage.get(SK_USER_ID_OLD);
  }

  private async userEquals(userSession: any): Promise<void> {
    let userIdOld = await this.getUserOld();
    if (userIdOld !== userSession.userId) {
      await this.offline.removeAll();
    }
  }

  public async getAuth(): Promise<any> {
    return await this.storage.get(SK_USER_SESSION);
  }
}
