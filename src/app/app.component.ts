import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

// Services
import { InterceptService } from './shared/services/intercept.service';
import { Router } from '@angular/router';
import { convertActionBinding } from '@angular/compiler/src/compiler_util/expression_converter';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  providers: [InterceptService]
})

export class AppComponent implements OnInit {
  public selectedIndex = 0;
  public appPages = [];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];

  // components
  showMenu: boolean = true;
  // searchShow: boolean = false;
  loadingPlure: boolean = true;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private interceptService: InterceptService,
    private router: Router
  ) {
    this.initializeApp();
    this.initializeSubscribe();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  ngOnInit() {
    const path = window.location.pathname.split('folder/')[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
    }
    this.onUserLogin();
  }

  // Initializes observable methods.
  initializeSubscribe() {
    // method menu with change.
    this.interceptService.newMenu$.subscribe(
      obj => {
        this.appPages = obj.menu;
        this.showMenu = obj.showMenu;
      }
    );
    // // search window with array.
    // this.interceptService.searchShow$.subscribe(
    //   obj => {
    //     this.searchShow = obj.show;
    //   }
    // );
    // loading wuindow with gif.
    this.interceptService.loading$.subscribe(
      bool => {
        this.loadingPlure = bool;
      }
    )
  }

  // Get Menu
  onLoadMenu() {
    this.interceptService.announceRouteMenu("Hola");
  }

  // identifies if the user is logged in plure with any user.
  onUserLogin() {
    // let userSession = JSON.parse(localStorage.getItem('userSession'));
    // if ( userSession !== null && userSession !== undefined && location.pathname === '/login' ) { 
    //   // verificar el fecha de expiracion.
    //   this.router.navigateByUrl('init/home');
    //   this.onTimeOut();
    // } else if (location.pathname !== '' && location.pathname !== '/login' ) {
    //   this.router.navigateByUrl('');
    // }
    this.loadingPlure = false;
  }

  onTimeOut() {
    setTimeout(() => 
    {
      this.onUserLogin();
    }, 20000);
  }
}
