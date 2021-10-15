import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { sha512 } from 'js-sha512'

// import services
import { ApiService } from '@svc/api.service';
import { InterceptService } from '@svc/intercept.service';
import { JsonService } from '@svc/json.service';

// import vars
import { SK_AUTHORIZE_ACCESS_CLIENT, SK_USER_SESSION } from '@var/consts';

import { Plugins } from '@capacitor/core';
import { AuthService } from '@svc/auth.service';
const { App } = Plugins;

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {
  public frm: FormGroup;
  public avatar: string = "../../../../../assets/img/img-robot.svg";
  private scid: string;
  private userSession: any = {};

  showPassword: Array<boolean> = [false, false, false];
  passwordToggleIcon: Array<string> = ['eye', 'eye', 'eye'];

  constructor(private formBuilder: FormBuilder
    , private intServ: InterceptService
    , private storage: Storage
    , private apiService: ApiService
    , private jsonServ: JsonService
    , private router: Router    
    , private authService: AuthService
  ) 
  {
    let objFunc = {
      func: () => {
        this.onBack();
      }
    };
    this.intServ.appBackFunc(objFunc);
    
    this.frm = this.formBuilder.group({
      LastPassword: ['', Validators.required],
      NewPassword: ['', Validators.required],
      ConfirmNewPassword: ['', Validators.required],
    }, {
      validators: this.matchingPasswords('NewPassword', 'ConfirmNewPassword')
    });
  }

  matchingPasswords(newPassword: string, confirmNewPassword: string) {
    return (group: FormGroup): {[key: string]: any} => {
      let password = group.controls[newPassword];
      let confirmPassword = group.controls[confirmNewPassword];

      if (password.value !== confirmPassword.value) {
        return {
          passwordNotMatch: true
        };
      }
    }
  }

  ngOnInit() {
    this.storage.get(SK_AUTHORIZE_ACCESS_CLIENT).then(
      res => {
        this.scid = JSON.parse(res).customerId;
      }
    );

    this.storage.get(SK_USER_SESSION).then(
      res => {
        this.userSession = JSON.parse(res);
      }
    );
    this.getAvatar();
  }

  async getAvatar() {
    this.intServ.loadingFunc(true);
    await this.authService.getUserSession().then(
      res => {
        this.userSession = res;
        if(this.userSession.avatar != null && this.userSession.avatar != undefined && this.userSession.avatar != '') {
          this.avatar = this.userSession.avatar;
        }
        this.intServ.loadingFunc(false);
      }
    )
  }

   /**
   * Return to the main/settings.
   */
    onBack() {
      this.router.navigate(['page/main/settings'], {replaceUrl: true});
    }

  onSubmit() {
    {
      this.intServ.loadingFunc(true);
      let data = {
        customerId: this.scid,
        mobileUserId: this.userSession.userId,
        lastPassword: this.userSession.temporaryPassword ? this.frm.value.LastPassword : sha512(this.frm.value.LastPassword),
        newPassword: sha512(this.frm.value.NewPassword)
      }
      this.apiService.postData('mobileUser', 'changepassword', data).then(
        async res => {
          if(res.isChangedPassword) {
            await this.storage.remove(SK_USER_SESSION);
            this.router.navigate(['login'], { replaceUrl: true });
            this.intServ.loadingFunc(false);
            this.intServ.alertFunc(this.jsonServ.getAlert('success', 'Info', 'Your password has changed, please sign in again.'))
          }
          else {
            this.intServ.alertFunc(this.jsonServ.getAlert('alert', 'Error', 'An error occurred while changing the password'));
            this.intServ.loadingFunc(false);
          }
        }
      ).catch(
        err => {
          this.intServ.loadingFunc(false);
          this.intServ.alertFunc(this.jsonServ.getAlert('alert', 'Error', err.error.message)
          );
        }
      );
    }
  }

  togglePassword(idx: number): void {
    this.showPassword[idx] = !this.showPassword[idx];
    this.passwordToggleIcon[idx] = this.showPassword[idx] ? 'eye-off' : 'eye';
  }
}
