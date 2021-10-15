import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// import services
import { AuthService } from '@svc/auth.service';
import { ApiService } from '@svc/api.service';
import { InterceptService } from '@svc/intercept.service';
import { JsonService } from '@svc/json.service';
import { Router } from '@angular/router';
import { Camera, CameraResultType } from '@capacitor/camera';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  public userSession: any = {}
  public avatar: string = "../../../../../assets/img/img-robot.svg";
  public frm: FormGroup;
  public showFooter: boolean = true;

  constructor(private authService: AuthService
    , private formBuilder: FormBuilder
    , private apiService: ApiService
    , private intServ: InterceptService
    , private jsonServ: JsonService
    , private router: Router
  ) {
    let objFunc = {
      func: () => {
        this.onBack();
      }
    };
    this.intServ.appBackFunc(objFunc);
    this.init();
    this.frm = this.formBuilder.group(
      {
        UserName: ['', Validators.required],
        Email: ['', Validators.required]
      }
    );
  }

  ngOnInit() {
    this.init();
  }

  async init() {
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

    this.intServ.loadingFunc(true);
    if(this.frm.valid) {
      let data = {
        mobileUserId: this.userSession.userId,
        customerId: this.userSession.customerId,
        name: this.frm.value.UserName,
        email: this.frm.value.Email,
        avatar: this.avatar
      }

      this.apiService.postData("mobileuser", "updatemobileuser", data).then(
        res => {
          this.userSession.avatar = this.avatar;
          this.userSession.userName = this.frm.value.UserName;
          this.userSession.email = this.frm.value.Email;

          this.authService.saveUserSession(this.userSession);
          this.intServ.avatarFuntion(this.userSession);

          this.router.navigate(['page/main/settings'], { replaceUrl: true})

          this.intServ.loadingFunc(false);
        }
      )
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
   * Change image
   */
  async onChangeAvatar() {
    try {
      const image = await Camera.getPhoto({
        quality: 75,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        width: 500,
        height: 500
      });
      let base64String = "data:image/png;base64," + image.base64String;
      this.avatar = base64String;
    } catch (error) {
      this.intServ.alertFunc(this.jsonServ.getAlert('alert', 'Alert', 'An error occurred while selecting the image'));
    }
  }
}
