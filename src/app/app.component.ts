import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { Plugins } from '@capacitor/core';
const { App, Keyboard } = Plugins;

// Services
import { InterceptService } from '@svc/intercept.service';
import { Platform } from '@ionic/angular';
import { UserService } from '@svc/user.service';
import { JsonService } from '@svc/json.service';
import { E_NOTIFYTYPE } from '@var/enums';
import { NotifyService } from '@svc/notify.service';
import { debug } from 'console';
import { AuthService } from '@svc/auth.service';

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
    , private userService: UserService
    , private intServ: InterceptService
    , private js: JsonService
    , private notify: NotifyService
    , private authService: AuthService
    , private router: Router
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
    /*Keyboard.addListener('keyboardDidShow', info => {
      this.interceptService.showFooter(false);
    });
    Keyboard.addListener('keyboardDidHide', () => {
      this.interceptService.showFooter(true);
    });*/
    // this.onUniversalLink();
  }

  ngOnInit() {
    this.initialCompareVersion();

    document.body.setAttribute('color-theme', 'light');
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

  private async initialCompareVersion() {
    try {
      const userSession = await this.authService.getUserSession();
      if (userSession !== null) {
        const compareVersion: any = await this.userService.compareVersion();
        if (compareVersion.error === undefined) {
          if (compareVersion.versionAppUpgrade !== null) {
            await this.messageUpdateVersion(compareVersion.versionAppUpgrade.versionName);
            this.intServ.alertFunc(this.js.getAlert('alert', 'Alert', `Mobile version '${compareVersion.versionAppUpgrade.versionName}' is available.`));
          }
        } 
      }
    } catch ({error}) {
      this.intServ.loadingFunc(false);
      // this.intServ.alertFunc(this.js.getAlert('error', 'Error', error.message, 
      //   () => {
      //     setTimeout(() => {
      //       this.intServ.alertFunc(this.js.getAlert('alert', 'Alert', 
      //       'Because your version is not compatible with the version installed in the ERP you will be redirected to login.',
      //         async () => {
      //           await this.authService.signout();
      //           this.router.navigate(['login'], { replaceUrl: true});
      //         }
      //       ));
      //     }, 1000)
      //   }
      // ));
    }
  }

  private async messageUpdateVersion(version) {
    await this.notify.createNotification(E_NOTIFYTYPE.Notify, `Mobile version '${version}' is available.`, false);
  }
}
