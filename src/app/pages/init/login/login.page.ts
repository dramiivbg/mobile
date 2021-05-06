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

// import services
import { ApiService } from '@svc/api.service';
import { InterceptService } from '@svc/intercept.service';
import { JsonService } from '@svc/json.service';

// import vars
import { SK_AUTHORIZE_ACCESS_CLIENT, SK_REMEMBER_ME, SK_SESSION_CUSTOMER_ID, SK_USER_LOGIN, SK_USER_SESSION } from '@var/consts';
import { error } from 'selenium-webdriver';
import { AuthService } from '@svc/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {
  private scid: string; // Session Customer Id
  frm: FormGroup;
  public environments: Array<any> = [];
  rememberMe: boolean = false;

  constructor(private intServ: InterceptService,
    private apiConnect: ApiService,
    private formBuilder: FormBuilder,
    private jsonServ: JsonService,
    private router: Router,
    private storage: Storage,
    private device: Device,
    private authSvc: AuthService) { 
    intServ.modifyMenu({menu: [], showMenu: false});
    this.frm = this.formBuilder.group(
      {
        EnviromentId: ['', Validators.required],
        User: ['', Validators.required],
        Password: ['', Validators.required],
      }      
    )
  }

  ngOnInit() {
    this.storage.get(SK_AUTHORIZE_ACCESS_CLIENT).then(
      res => {
        this.scid = JSON.parse(res).customerId;
      }
    );    
  }

  async onRememberMe() {
    this.rememberMe = await this.storage.get(SK_REMEMBER_ME);
    if(this.rememberMe) {
      let secretKey = await this.storage.get(SK_USER_LOGIN);
      this.signIn(secretKey);
    }    
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

          console.log(`remember_me => ${this.rememberMe}`);

          this.storage.set(SK_REMEMBER_ME, this.rememberMe);
          if(this.rememberMe)
            this.storage.set(SK_USER_LOGIN, secretKey);

          this.storage.set(SK_USER_SESSION, JSON.stringify(res));

          this.router.navigateByUrl('', { replaceUrl: true });
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
    let data = {
      "customerId": this.scid,
      "login": this.frm.value.User,
      "platformCode": environment.platformCode
    };

    this.onGetEnvironments(data);
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
      this.intServ.loadingFunc(false);
      this.intServ.alertFunc(this.jsonServ.getAlert('alert', 'Error', err.error.message));
      this.frm.controls['User'].setValue('');
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

}
