import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { Storage } from '@ionic/storage';
import { EmailComposer } from '@ionic-native/email-composer/ngx';

// import services
import { AuthService } from '@svc/auth.service';
import { InterceptService } from '@svc/intercept.service';
import { SK_SELECTED_COMPANY } from '@var/consts';

export interface MenuItem {
  description: string,
  iconName: string,
  iconPath: string,
  action: string
}

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {

  userSession: any = {};
  selectedCompany: any = {};
  version: string = "";
  avatar: string = "../../assets/img/img-robot.svg";

  menuContent: Array<MenuItem> = [
    {
      description: "Modules",
      iconName: "",
      iconPath: "../../assets/img/modules/modules.svg",
      action: "modules"
    },
    {
      description: "Change Company",
      iconName: "",
      iconPath: "../../assets/img/modules/change_company.svg",
      action: "change_company",
    },
    {
      description: "Settings",
      iconName: "settings-outline",
      iconPath: "",
      action: "settings",
    },
    {
      description: "Support",
      iconName: "",
      iconPath: "../../assets/icon/support.svg",
      action: "support",
    },
    {
      description: "Sync",
      iconName: "sync-circle-outline",
      iconPath: "",
      action: "sync",
    },
    {
      description: "Sign out",
      iconName: "",
      iconPath: "../../assets/img/modules/sign_out.svg",
      action: "sign_out"
    }
  ];
  selectedPath = '';

  constructor(private intServ: InterceptService
    , private authService: AuthService
    , private router: Router
    , private storage: Storage
    , private appVersion: AppVersion
    , private emailComposer: EmailComposer) {
    this.getVersion();
    this.init();

    this.intServ.avatar$.subscribe(
      obj => {
        this.userSession = obj;
        if(this.userSession.avatar != null && this.userSession.avatar != undefined && this.userSession.avatar != '') {
          this.avatar = this.userSession.avatar;
        }
      }
    )

    this.intServ.changeCompany$.subscribe(
      obj => {
        this.selectedCompany = obj
      }
    )
  }

  async init() {
    await this.authService.getUserSession().then(
      res => {
        this.userSession = res;
        if(this.userSession.avatar != null && this.userSession.avatar != undefined && this.userSession.avatar != '') {
          this.avatar = this.userSession.avatar;
        }
      }
    );

    this.storage.get(SK_SELECTED_COMPANY).then(
      res => {
        this.selectedCompany = JSON.parse(res);
      }
    )
  }

  async ngOnInit() {
    this.router.events.subscribe((event: RouterEvent) => {
      this.selectedPath = event.url;
    });
  }

  async onClick(action: string){
    switch(action)
    {
      case "modules":
          this.router.navigate(['page/main/modules'], { replaceUrl: true });
        break;

      case "change_company":
        this.router.navigate(['page/main/change-company'], { replaceUrl: true });
        break;

      case "settings":
        this.router.navigate(['page/main/settings'], { replaceUrl: true });
        break;

      case "sync":
        this.router.navigate(['page/main/init/sync'], { replaceUrl: true });
        break;

      case "support":
        this.support();
        break;

      case "sign_out":
        this.onSignout();
        break;

      default:
        break;
    }
  }


  employee(event){

    console.log('evento',event);

    this.router.navigate(['page/main/employee']);

    
  }

  async onSignout() {
    await this.authService.signout();
    this.router.navigate(['login'], { replaceUrl: true});
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

  private async support() {
    let email = {
      to: 'support@plur-e.com',
      cc: '',
      bcc: [],
      subject: 'Plur-E Support',
      body: '',
      isHtml: true
    }
    this.emailComposer.open(email);
  }

}
