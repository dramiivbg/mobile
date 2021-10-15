import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@svc/auth.service';

import { Plugins } from '@capacitor/core';
import { InterceptService } from '@svc/intercept.service';
const { App } = Plugins;

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  userSession: any = {}
  avatar: string = "../../../../assets/img/img-robot.svg"

  constructor(private authService: AuthService
    , private router: Router
    , private intServ: InterceptService
  ) {
    let objFunc = {
      func: () => {
        this.onBack();
      }
    };
    this.intServ.appBackFunc(objFunc);
    this.init();
  }

  ngOnInit() {
  }

  async init() {
    await this.authService.getUserSession().then(
      res => {
        this.userSession = res;
        if(this.userSession.avatar != null && this.userSession.avatar != undefined && this.userSession.avatar != '') {
          this.avatar = this.userSession.avatar;
        }
      }
    )
  }

  /**
    * Return to the modules.
    */
  onBack() {
    this.router.navigate(['page/main/modules'], {replaceUrl: true});
  }

  onClick(setting: string) {
    switch(setting) {
      case 'profile':
        this.router.navigate(['page/main/settings/profile'], { replaceUrl: true });
        break;

      case 'change-password':
        this.router.navigate(['page/main/settings/change-password'], { replaceUrl: true });
        break;

      default:
        break;
    }
  }

}
