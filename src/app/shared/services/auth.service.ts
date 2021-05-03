import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

// import vars
import { SK_SESSION_LOGIN } from '@var/consts';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userSession: any = {};

  constructor(private storage: Storage) { 
    //this.storage.get(SK_SESSION_LOGIN).then(res => this.userSession = JSON.parse(res));
  }

  /*getUserSession(): Promise<any> {
    return  new Promise((resolve, reject) => {this.storage.get(SK_SESSION_LOGIN)
    .then(
      res => {
        this.userSession = JSON.parse(res);
        resolve(this.userSession);        
      });          
    })
  }*/

  async getUserSession(): Promise<any> {
    return this.storage.get(SK_SESSION_LOGIN).then(res => this.userSession = JSON.parse(res));
  }

  async signout(): Promise<any> {
    return this.storage.remove(SK_SESSION_LOGIN);    
  }
}
