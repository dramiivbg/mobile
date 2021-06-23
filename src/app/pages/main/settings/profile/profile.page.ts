import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { Plugins } from '@capacitor/core';

// import services
import { AuthService } from '@svc/auth.service';
import { Platform } from '@ionic/angular';
import { ApiService } from '@svc/api.service';
import { InterceptService } from '@svc/intercept.service';
import { throwIfEmpty } from 'rxjs/operators';
import { JsonService } from '@svc/json.service';
import { Router } from '@angular/router';

const { Filesystem } = Plugins;
const { App } = Plugins;


@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  userSession: any = {}
  avatar: string = "../../../../../assets/img/img-robot.svg";

  frm: FormGroup;

  constructor(private authService: AuthService,
    private formBuilder: FormBuilder,
    private fileChooser: FileChooser,
    private filePath: FilePath,
    private platform: Platform,
    private apiService: ApiService,
    private intServ: InterceptService,
    private jsonServ: JsonService,
    private router: Router) 
  {
    App.removeAllListeners();
    App.addListener('backButton', () => {
      this.onBack();
    });
    this.frm = this.formBuilder.group(
      {
        UserName: ['', Validators.required],
        Email: ['', Validators.required]
      }
    )
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
    this.router.navigate(['main/settings']);
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

          this.router.navigateByUrl("main/settings", { replaceUrl: true})

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

  onChangeAvatar() {
    if(this.platform.is("cordova")) {
      this.fileChooser.open({mime: "image/*"}).then(
        fileUri => {
          this.filePath.resolveNativePath(fileUri).then(
            nativePath => {
              Filesystem.readFile({
                path: nativePath
              }).then(base64 => {
                let base64String = "data:image/png;base64," + base64.data;
                this.avatar = base64String;
              })
            }
          )
        }
      )
    }
  }

}
