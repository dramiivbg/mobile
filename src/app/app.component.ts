import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Plugins } from '@capacitor/core';
const { App } = Plugins;

// Services
import { InterceptService } from '@svc/intercept.service';
import { throwIfEmpty } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  providers: [InterceptService]
})

export class AppComponent implements OnInit {
  
  loadingPlure: boolean = false;

  constructor(
    private interceptService: InterceptService,
    private router: Router,
    private zone: NgZone
  ) {
    this.initializeApp();
    this.initializeSubscribe();
  }

  initializeApp() {
    this.onUniversalLink();
  }
  
  ngOnInit() {    
  }

  onUniversalLink(): void{
    App.addListener('appUrlOpen', (data: any) => {
      this.zone.run(() => {
        const slug = data.url.split(".app").pop();
        if(slug)
          console.log(slug);
      });    
    });  
  }  

  // Initializes observable methods.
  initializeSubscribe() {
    this.interceptService.loading$.subscribe(
      bool => {
        this.loadingPlure = bool;
      }
    )
  }
}
