import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { Plugins } from '@capacitor/core';
const { App } = Plugins;

// Services
import { InterceptService } from '@svc/intercept.service';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  providers: [InterceptService]
})

export class AppComponent implements OnInit {
  objBackOld: any = undefined;
  objBack: any = undefined;
  loadingPlure: boolean = false;

  constructor(private interceptService: InterceptService
    , private zone: NgZone
    , private screenOrientation: ScreenOrientation
    , private platform: Platform
  ) {
    this.initializeApp();
    this.initializeSubscribe();
    this.platform.ready().then(() => {
      this.platform.backButton.subscribeWithPriority(9999, () => {
        if (this.objBack !== undefined) {
          if (this.objBack.comp !== undefined) {
            this.objBack.func();
            this.objBack = this.objBackOld;
          } else {
            this.objBack.func();
          }
        }
      });
    });
  }

  lockPortrait() {
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
  }

  initializeApp() {
    // this.onUniversalLink();
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
    /**
     * back function
     */
    this.interceptService.appBack$.subscribe(
      r => {
        if (r.old === undefined) {
          if (r.comp !== undefined) {
            if (this.objBack !== undefined) {
              if (this.objBack.comp === undefined) {
                this.objBackOld = this.objBack;  
              }
            } else
              this.objBackOld = this.objBack;
          } else {
            this.objBackOld = undefined;
          }
          this.objBack = r;
        } else {
          this.objBack = this.objBackOld;
        }
      }
    )
  }
}
