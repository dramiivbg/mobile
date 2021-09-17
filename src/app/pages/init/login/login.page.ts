import { getLocaleMonthNames } from '@angular/common';
import { CommentStmt } from '@angular/compiler';
import { CloneVisitor } from '@angular/compiler/src/i18n/i18n_ast';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '@env/environment';
import { Storage } from '@ionic/storage';
import { Device } from '@ionic-native/device/ngx'
import { sha512 } from 'js-sha512'
import { AppVersion } from '@ionic-native/app-version/ngx';

// import services
import { ApiService } from '@svc/api.service';
import { InterceptService } from '@svc/intercept.service';
import { JsonService } from '@svc/json.service';
import { AuthService } from '@svc/auth.service';

// import vars
import { SK_AUTHORIZE_ACCESS_CLIENT, SK_SESSION_CUSTOMER_ID } from '@var/consts';

import { Plugins } from '@capacitor/core';
import { NotifyService } from '@svc/notify.service';
import { E_NOTIFYTYPE } from '@var/enums';
import { UserService } from '@svc/user.service';
const { App } = Plugins;

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {

  version: string = "";
  showPassword = false;
  passwordToggleIcon = 'eye';
  
  public environments: Array<any> = [];
  frm: FormGroup;

  constructor(private intServ: InterceptService
    , private apiConnect: ApiService
    , private formBuilder: FormBuilder
    , private jsonServ: JsonService
    , private router: Router
    , private storage: Storage
    , private device: Device
    , private authSvc: AuthService
    , private appVersion: AppVersion
    , private notify: NotifyService
    , private userService: UserService
  ) {
    let objFunc = {
      func: () => {
        this.onBack();
      }
    };
    this.intServ.appBackFunc(objFunc);
    intServ.modifyMenu({menu: [], showMenu: false});
    this.frm = this.formBuilder.group(
    {
        EnviromentId: ['', Validators.required],
        User: ['', Validators.required],
        Password: ['', Validators.required],
      }
    )

    this.getVersion();
  }

  ngOnInit() {
    /*this.storage.get(SK_AUTHORIZE_ACCESS_CLIENT).then(
      res => {
        this.scid = JSON.parse(res).customerId;
      }
    );*/
  }

  public togglePassword(): void {
    this.showPassword = !this.showPassword;
    this.passwordToggleIcon = this.showPassword ? 'eye-off' : 'eye';
  }

  private async signIn(secretKey: string) {
    try {
      let authorizationToken = sha512(`${secretKey}-${environment.passphrase}`);
      const compareVersion: any = await this.userService.compareVersionByEnvironment(this.frm.value.EnviromentId);
      console.log(compareVersion);
      // if (compareVersion.error === undefined) {
      let data = {
        appSource: environment.appSource,
        secretKey: secretKey,
        authorizationToken: authorizationToken,
        environmentId: this.frm.value.EnviromentId,
        uuid: this.device.uuid
      };
  
      this.apiConnect.postData('loginuser', 'authentication', data).then(
        res => {
          if ( res.token != null ) {
            if(this.authSvc.saveUserSession(res)) {
              this.messageWelcome();
              this.router.navigateByUrl('change-password', { replaceUrl: true });
            }
            this.intServ.loadingFunc(false);
          } else {
            this.intServ.alertFunc(this.jsonServ.getAlert(
              'alert',
              'Error',
              `The user or password is not correct.`,
              () => {
                this.intServ.loadingFunc(false);
              })
            );
          }
        }
      )
      .catch(
        err => {
          this.intServ.loadingFunc(false);
          this.intServ.alertFunc(this.jsonServ.getAlert('alert', 'Error', err.error.message)
          );
        }
      );   
    } catch ({error}) {
      this.intServ.loadingFunc(false);
      this.intServ.alertFunc(this.jsonServ.getAlert('error', 'Error', error.error.message));
    }
    
  }

  // login to the application is performed.
  public onSubmit() {
    this.intServ.loadingFunc(true);
    if (this.frm.valid) {
      //let secretKey = sha512(`${this.frm.value.User}@${this.scid}:${sha512(this.frm.value.Password)}`);
      let login = this.frm.value.User.toLowerCase();
      let secretKey = sha512(`${login}:${sha512(this.frm.value.Password)}`);
      console.log('secretKey', secretKey);      
      this.signIn(secretKey);
    } else {
      this.intServ.alertFunc(this.jsonServ.getAlert(
        'alert',
        'Error',
        'plase fill fields.'
      ));
      this.intServ.loadingFunc(false);
    }
  }

  // remove environment with confirm
  public onRemoveEnvironment() {
    this.intServ.alertFunc(this.jsonServ.getAlert(
      'confirm',
      'Confirm',
      `Do you want to change company ?`,
      () => {
        this.storage.remove(SK_SESSION_CUSTOMER_ID);
        this.router.navigate(['enviroments'], {replaceUrl: true});
      })
    );
  }

  public onBack() {
    this.storage.remove(SK_AUTHORIZE_ACCESS_CLIENT);
    this.router.navigate(['environments'], {replaceUrl: true});
  }

  async authorizeAccessClient(customerId: string) {
    let data = {
      customerId: customerId,
      platformCode: environment.platformCode,
      uuid: this.device.uuid
    }

    return this.apiConnect.postData('mobile', 'authorizeAccessClient', data)
    .then(
      res => {        
        this.storage.set(SK_AUTHORIZE_ACCESS_CLIENT, JSON.stringify(res));        
      }
    )
    .catch(error => {
      error = error.error;
      this.intServ.alertFunc(this.jsonServ.getAlert('alert', 'Error', `${error.message}`));      
    });
  }

  onChangeUser(event: any){
    if(this.frm.value.User != "") {
      this.intServ.loadingFunc(true);      
      let login = this.frm.value.User.toLowerCase();
      if(this.frm.value.User !== "") {          
        this.apiConnect.postData('mobileUser', `checkingMobileUser`, { login }).then(
          res => {              
            this.authorizeAccessClient(res.customerId).finally(
              () => {
                var changeTemporaryPassword = res.temporaryPassword != '';
                if(changeTemporaryPassword) {
                  this.router.navigateByUrl('change-password', { state: {customerId: res.customerId, mobileUserId: res.id}, replaceUrl: true });
                  this.intServ.loadingFunc(false);
                }
                else {
                  let data = {
                    "login": login ,
                    "platformCode": environment.platformCode
                  };
                  this.onGetEnvironments(data);
                }
              }
            );                          
          }
        ).catch(
          err => {              
            this.frm.controls['User'].setValue('');                      
            this.intServ.alertFunc(this.jsonServ.getAlert('alert', 'Error', err.error.message));
          }
        )          
      }      
    }
  }

  public onGetEnvironments(data: any) {
    this.intServ.loadingFunc(true);
    this.apiConnect.postData('mobile', 'getenvironments', data)
    .then(
      res => {
        if(res.length > 0) {
          this.environments = res;
        }
        this.intServ.loadingFunc(false);
      }
    )
    .catch(err => {      
      this.frm.controls['User'].setValue('');

      this.intServ.loadingFunc(false);
      this.intServ.alertFunc(this.jsonServ.getAlert('alert', 'Error', err.error.message));
    });
  }

  onTest() {
    let obj = {
      type: 'confirm',
      func: () => {
        alert('Execute the alert with Yes in confirmation.');
      },
      title: 'Alert for test',
      desc: 'this is an alert for test this window'
    }
    this.intServ.alertFunc(obj);
  }

  public getVersion(): void {
    this.appVersion.getVersionNumber().then(
      res => {
        this.version = `v${res}`;
      }
    ).catch(
      err => this.version = `v0.0`
    );
  }

  private async messageWelcome() {
    let notifies = await this.notify.countNotifications();
    if (notifies === 0) {
      this.notify.createNotification(E_NOTIFYTYPE.Notify, 'Welcome to plur-e', false);
    }
  }

}
