import { Component, Input, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {

  private customerId: string;
  private mobileUserId: string;

  showPassword: Array<boolean> = [false, false, false];
  passwordToggleIcon: Array<string> = ['eye', 'eye', 'eye'];

  lbLastPassword = 'Temporary password';

  frmChangePassword: FormGroup;
  constructor(private formBuilder: FormBuilder
    , private storage: Storage
    , private apiService: ApiService
    , private intServ: InterceptService
    , private jsonServ: JsonService
    , private router: Router) 
  {
    let objFunc = {
      func: () => {
        this.onBack();
      }
    };
    this.intServ.appBackFunc(objFunc);
    this.frmChangePassword = this.formBuilder.group({
        LastPassword: ['', Validators.required],
        NewPassword: ['', Validators.required],
        ConfirmNewPassword: ['', Validators.required],
      }, {
        validators: this.matchingPasswords('NewPassword', 'ConfirmNewPassword')
      }
    )
  }

  matchingPasswords(newPassword: string, confirmNewPassword: string) {
    return (group: FormGroup): {[key: string]: any} => {
      let password = group.controls[newPassword];
      let confirmPassword = group.controls[confirmNewPassword];

      if (password.value !== confirmPassword.value) {
        return {
          mismatchedPasswords: true
        };
      }
    }
  }

  ngOnInit() {
    console.log('change-password', this.router.getCurrentNavigation().extras.state);
    let extras = this.router.getCurrentNavigation().extras.state;
    this.customerId = extras.customerId;
    this.mobileUserId = extras.mobileUserId;
  }

  onSubmit() {
    if(this.frmChangePassword.valid) {
      this.intServ.alertFunc(this.jsonServ.getAlert('confirm', 'Confirm', `Do you want to change password?`,
        () => {
          this.onChangePassword();
        })
      );
    }    
  }

  onChangePassword() {
    
    this.intServ.loadingFunc(true);
    
    let data = {
      customerId: this.customerId,
      mobileUserId: this.mobileUserId,
      lastPassword: this.frmChangePassword.value.LastPassword,
      newPassword: sha512(this.frmChangePassword.value.NewPassword)
    }

    console.log('onChangePassword', data);
    
    this.apiService.postData('mobileUser', 'changepassword', data).then(
      async res => {
        if(res.isChangedPassword) {
          await this.storage.remove(SK_USER_SESSION);
          this.router.navigateByUrl('login', { replaceUrl: true });
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

  async onBack() {
    await this.storage.remove(SK_USER_SESSION);
    this.router.navigate(['login'], {replaceUrl: true});
  }

  togglePassword(idx: number): void {
    this.showPassword[idx] = !this.showPassword[idx];
    this.passwordToggleIcon[idx] = this.showPassword[idx] ? 'eye-off' : 'eye';
  }

}
