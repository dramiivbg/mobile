import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuService } from 'src/app/data/menu.service';
import { ApiService } from 'src/app/services/api.service';
import { InterceptService } from 'src/app/services/intercept.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html'
})
export class HomePage implements OnInit {

  constructor(
    private interceptService: InterceptService,
    private menuService: MenuService,
    private apiConnect: ApiService,
    private router: Router
    ) { 
      let menu = {
        menu: this.menuService.menuData(),
        showMenu: true
      }
      this.interceptService.modifyMenu(menu);
    }

  ngOnInit() {
    // let sessionLogin = JSON.parse(localStorage.getItem('SessionLogin'));
    // if ( sessionLogin !== null && sessionLogin !== undefined && location.pathname === '/login' ) {
    //   this.router.navigateByUrl('login');
    // } else if (location.pathname !== '' && location.pathname !== '/login' ) {
    //   this.router.navigateByUrl('');
    // }
  }

}
