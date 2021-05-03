import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';

// import services
import { AuthService } from '@svc/auth.service';

export interface MenuItem {
  url: string,
  description: string,
  icon: string
}

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {
  
  info: string;
  userSession: any = {};
  menuContent: Array<MenuItem> = [];
  selectedPath = '';

  constructor(private authService: AuthService,               
            private router: Router) {  
              this.test();             
  }

  async test() {
    await this.authService.getUserSession().then( async (res: any) => {
      this.userSession = res;
      console.log(this.userSession);
      this.info = `${this.userSession.defaultCompany.companyName}${this.userSession.defaultCompany.companyId}`;
    });   
  }

  async ngOnInit() {
             

    this.router.events.subscribe((event: RouterEvent) => {
      this.selectedPath = event.url;
    });

    this.menuContent.push({
      description: "Modules",
      icon: "../../assets/img/modules/modules.svg",
      url: "/main/home"
    });
    this.menuContent.push({
      description: "Change Company",
      icon: "../../assets/img/modules/change_company.svg",
      url: "/main/change_company"
    });
    this.menuContent.push({
      description: "Modules",
      icon: "../../assets/img/modules/sign_out.svg",
      url: "/main/sign_out"
    });
  }

}
