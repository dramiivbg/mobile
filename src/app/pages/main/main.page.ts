import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';

// import services
import { AuthService } from '@svc/auth.service';

export interface MenuItem {
  description: string,
  icon: string,
  action: string
}

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {
  
  info: string;
  userSession: any = {};
  menuContent: Array<MenuItem> = [
    {
      description: "Modules",
      icon: "../../assets/img/modules/modules.svg",
      action: "modules"
    },
    {
      description: "Change Company",
      icon: "../../assets/img/modules/change_company.svg",
      action: "change_company",
    },
    {
      description: "Sign out",
      icon: "../../assets/img/modules/sign_out.svg",
      action: "sign_out"
    }
  ];
  selectedPath = '';

  constructor(private authService: AuthService,               
            private router: Router) {      
  }

  async ngOnInit() {
    await this.authService.getUserSession().then(
      res => {
        this.userSession = res;
        console.log(res);
      }
    );         

    this.router.events.subscribe((event: RouterEvent) => {
      this.selectedPath = event.url;
    });
  }

  onClick(action: string){
    switch(action)
    {
      case "modules": 
          this.router.navigateByUrl('', { replaceUrl: true });
        break;

      case "change_company":
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
