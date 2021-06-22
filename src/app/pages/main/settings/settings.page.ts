import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@svc/auth.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  userSession: any = {}
  avatar: string = "../../../../assets/img/img-robot.svg"

  constructor(private authService: AuthService,
    private router: Router) {
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

  onClick(setting: string) {
    switch(setting) {
      case 'profile':
        this.router.navigateByUrl('main/settings/profile', { replaceUrl: true });
        break;

      case 'change-password':
        this.router.navigateByUrl('main/settings/change-password', { replaceUrl: true });
        break;

      default:
        break;
    }
  }

}
