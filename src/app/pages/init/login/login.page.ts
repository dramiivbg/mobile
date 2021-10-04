import { getLocaleMonthNames } from '@angular/common';
import { CommentStmt } from '@angular/compiler';
import { CloneVisitor } from '@angular/compiler/src/i18n/i18n_ast';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
import { ModalController, Platform } from '@ionic/angular';
import { ChangeInstanceService } from '../change-instance/change-instance.service';
import { ChangeInstancePage } from '../change-instance/change-instance.page';
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
  changeInstance = 0;
  instances = ['Development', 'Test', 'Live']

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
    , private changeInstanceService: ChangeInstanceService
    , private modalController: ModalController
    , private userService: UserService
  ) {
    let objFunc = {
      func: () => {
        this.onBack();
      }
    };
    this.intServ.appBackFunc(objFunc);
    intServ.modifyMenu({ menu: [], showMenu: false });
    this.frm = this.formBuilder.group(
      {
        User: new FormControl('', [
          Validators.required,
          Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$")
        ]),
        Password: ['', Validators.required],
        EnviromentId: ['', Validators.required],
      }
    )

    this.getVersion();
  }

  ngOnInit() {}

  public togglePassword(): void {
    this.showPassword = !this.showPassword;
    this.passwordToggleIcon = this.showPassword ? 'eye-off' : 'eye';
  }

  /**
   * Login to the application is performed. 
  */ 
  public onSubmit() {
    this.intServ.loadingFunc(true);
    if (this.frm.valid) {
      //let secretKey = sha512(`${this.frm.value.User}@${this.scid}:${sha512(this.frm.value.Password)}`);
      let login = this.frm.value.User.toLowerCase();
      let secretKey = sha512(`${login}:${sha512(this.frm.value.Password)}`);
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

  /**
   * remove environment with confirm
   */
  public onRemoveEnvironment() {
    this.intServ.alertFunc(this.jsonServ.getAlert(
      'confirm',
      'Confirm',
      `Do you want to change company ?`,
      () => {
        this.storage.remove(SK_SESSION_CUSTOMER_ID);
        this.router.navigate(['enviroments'], { replaceUrl: true });
      })
    );
  }

  public onBack() {
    this.storage.remove(SK_AUTHORIZE_ACCESS_CLIENT);
    this.router.navigate(['environments'], { replaceUrl: true });
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

  public onChangeUser(event: any) {
    if (this.frm.controls['User'].valid) {
      this.intServ.loadingFunc(true);
      let login = this.frm.value.User.toLowerCase();
      if (this.frm.value.User !== "") {
        this.apiConnect.postData('mobileUser', `checkingMobileUser`, { login }).then(
          res => {
            this.authorizeAccessClient(res.customerId).finally(
              () => {
                var changeTemporaryPassword = res.temporaryPassword != '';
                if (changeTemporaryPassword) {
                  this.router.navigateByUrl('change-password', { state: { customerId: res.customerId, mobileUserId: res.id }, replaceUrl: true });
                  this.intServ.loadingFunc(false);
                }
                else {
                  let data = {
                    "login": login,
                    "platformCode": environment.platformCode
                  };
                  this.onGetEnvironments(data);
                }
              }
            );
          }
        ).catch(
          err => {
            this.intServ.loadingFunc(false);
            this.frm.controls['User'].setValue('');

            if (err.error != undefined) {
              this.intServ.alertFunc(this.jsonServ.getAlert('alert', 'Error', err.error.message));
            }
            else {
              this.intServ.alertFunc(this.jsonServ.getAlert('alert', 'Error', err.message));
            }
          }
        )
      }
    }
    else {
      if (this.frm.value.User != '') {
        this.frm.controls['User'].setValue('');
        this.intServ.alertFunc(this.jsonServ.getAlert('alert', 'Error', 'Please provide a valid email address'));
      }
    }
  }

  public onGetEnvironments(data: any) {
    this.intServ.loadingFunc(true);
    this.apiConnect.postData('mobile', 'getenvironments', data)
      .then(
        res => {
          if (res.length > 0) {
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
    await this.notify.createNotification(E_NOTIFYTYPE.Notify, 'Welcome to plur-e', false);
  }

  private async messageUpdateVersion(version) {
    await this.notify.createNotification(E_NOTIFYTYPE.Notify, `Mobile version '${version}' is available.`, false);
  }

  private async signIn(secretKey: string) {
    try {
      let authorizationToken = sha512(`${secretKey}-${environment.passphrase}`);
      const compareVersion: any = await this.userService.compareVersionByEnvironment(this.frm.value.EnviromentId);
      if (compareVersion.error === undefined) {
        let data = {
          appSource: environment.appSource,
          secretKey: secretKey,
          authorizationToken: authorizationToken,
          environmentId: this.frm.value.EnviromentId,
          uuid: this.device.uuid
        };
        if (compareVersion.versionAppUpgrade !== null) {
          this.intServ.alertFunc(this.jsonServ.getAlert('alert', 'Alert', `Mobile version '${compareVersion.versionAppUpgrade.versionName}' is available.`, 
          async () => {
            await this.loginUserAuth(data, compareVersion);
          }
          ));
        } else {
          await this.loginUserAuth(data, compareVersion);
        }
      }
    } catch ( {error} ) {
      this.intServ.loadingFunc(false);
      this.intServ.alertFunc(this.jsonServ.getAlert('error', 'Error', error.message));
    }
  }

  /**
   * Login and send notify
   * @param data {appSource, secretKey, authorizationToken, environmentId, uuid}
   * @param compareVersion 
   */
  private async loginUserAuth(data: any, compareVersion: any) {
    this.apiConnect.postData('loginuser', 'authentication', data).then(
      async res => {
        if (res.token != null) {
          if (this.authSvc.saveUserSession(res)) {
            await this.messageWelcome();
            if (compareVersion.versionAppUpgrade !== null) {
              await this.messageUpdateVersion(compareVersion.versionAppUpgrade.versionName);
            }
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
  }

  private async resetClic() {
    this.changeInstance = await this.changeInstanceService.resetClic();
  }

  async onChangeInstance() {
    if (this.changeInstance == 1) {
      this.resetClic();
    }
    this.changeInstance++;

    if (this.changeInstance == 5) {
      this.frm.reset();
      await this.presentChangeInstanceModal()
    }
  }

  async presentChangeInstanceModal() {
    const modal = await this.modalController.create({
      component: ChangeInstancePage,
      cssClass: 'my-custom-class',
      swipeToClose: true,
      presentingElement: await this.modalController.getTop() // Get the top-most ion-modal
    });
    return await modal.present();
  }
}

