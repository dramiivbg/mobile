import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';
import { Storage } from '@ionic/storage';

// import services
import { AuthService } from '@svc/auth.service';
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
      description: "Sync",
      iconName: "sync-circle-outline",
      iconPath: "",
      action: "Sync",
    },
    {
      description: "Sign out",
      iconName: "",
      iconPath: "../../assets/img/modules/sign_out.svg",
      action: "sign_out"
    }
  ];
  selectedPath = '';

  constructor(private authService: AuthService,
            private router: Router,
            private storage: Storage) {
  }

  async ngOnInit() {
    await this.authService.getUserSession().then(
      res => {
        this.userSession = res;
      }
    );

    this.storage.get(SK_SELECTED_COMPANY).then(
      res => {
        this.selectedCompany = JSON
      }
    )

    this.router.events.subscribe((event: RouterEvent) => {
      this.selectedPath = event.url;
    });
  }

  async onClick(action: string){
    switch(action)
    {
      case "modules":
          this.router.navigateByUrl('', { replaceUrl: true });
        break;

      case "change_company":
        this.router.navigateByUrl('main/change-company', { replaceUrl: true });
        break;

      case "settings":
        this.router.navigateByUrl('main/settings', { replaceUrl: true });
        break;

      case "sync":
        this.router.navigate(['init/sync'], { replaceUrl: true });
        break;

      case "sign_out":
        this.onSignout();
        break;

      default:
        break;
    }
  }

  async onSignout() {
    this.authService.signout().then(
      res => {
        this.router.navigateByUrl('/login', { replaceUrl: true});
      }
    );
  }

}
