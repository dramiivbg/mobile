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

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {

  version: string = "";
  showPassword = false;
  passwordToggleIcon = 'eye';

  private scid: string;
  private userName: string;
  public environments: Array<any> = [];
  frm: FormGroup;

  constructor(private intServ: InterceptService,
    private apiConnect: ApiService,
    private formBuilder: FormBuilder,
    private jsonServ: JsonService,
    private router: Router,
    private storage: Storage,
    private device: Device,
    private authSvc: AuthService,
    private appVersion: AppVersion) {
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
    this.storage.get(SK_AUTHORIZE_ACCESS_CLIENT).then(
      res => {
        this.scid = JSON.parse(res).customerId;
      }
    );
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
    this.passwordToggleIcon = this.showPassword ? 'eye-off' : 'eye';
  }

  signIn(secretKey: string) {
    let authorizationToken = sha512(`${secretKey}-${environment.passphrase}`);
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

  // login to the application is performed.
  onSubmit() {
    this.intServ.loadingFunc(true);
    if (this.frm.valid) {
      let secretKey = sha512(`${this.frm.value.User}@${this.scid}:${sha512(this.frm.value.Password)}`);
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
  onRemoveEnvironment() {
    this.intServ.alertFunc(this.jsonServ.getAlert(
      'confirm',
      'Confirm',
      `Do you want to change company ?`,
      () => {
        this.storage.remove(SK_SESSION_CUSTOMER_ID);
        this.router.navigateByUrl('enviroments');
      })
    );
  }

  onBack() {
    this.storage.remove(SK_AUTHORIZE_ACCESS_CLIENT);
  }

  onChangeUser(event: any){
    if(this.frm.value.User != "") {
      if(this.userName != this.frm.value.User) {
        this.userName = this.frm.value.User;
        if(this.frm.value.User !== "") {
          let data = {
            "customerId": this.scid,
            "login": this.userName ,
            "platformCode": environment.platformCode
          };
          this.onGetEnvironments(data);
        }
      }
    }
  }

  onGetEnvironments(data: any) {
    this.intServ.loadingFunc(true);
    this.apiConnect.postData('mobile', 'getenvironments', data)
    .then(
      res => {
        this.intServ.loadingFunc(false);
        if(res.length > 0) {
          this.environments = res;
        }
      }
    )
    .catch(err => {
      this.userName = '';
      this.frm.controls['User'].setValue(this.userName);

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

  getVersion(): void {
    this.appVersion.getVersionNumber().then(
      res => {
        this.version = `v${res}`;
      }
    ).catch(
      err => this.version = `v0.0`
    );
  }

}
