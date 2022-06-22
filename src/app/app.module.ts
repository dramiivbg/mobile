import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy, PopoverController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { Device } from '@ionic-native/device/ngx'
import { AppVersion } from '@ionic-native/app-version/ngx';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { Stripe } from '@ionic-native/stripe/ngx';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// import services
import { InterceptService } from '@svc/intercept.service';
import { ApiService } from '@svc/api.service';
import { JsonService } from '@svc/json.service';
import { SqlitePlureService } from '@svc/sqlite-plure.service';
import { GeneralService } from '@svc/general.service';
import { SyncerpService } from '@svc/syncerp.service';
import { OfflineService } from '@svc/offline.service';
import { NotifyService } from '@svc/notify.service';

// import components
import { LoadingComponent } from './components/loading/loading.component';
import { AlertsComponent } from './components/alerts/alerts.component';
import { NotifyComponent } from './components/notify/notify.component';
import { UserService } from '@svc/user.service';
import { PrivateModule } from '@prv/private.module';
import { WmsService } from '@svc/wms.service';

@NgModule({
  declarations: [
    AppComponent,
    LoadingComponent,
    AlertsComponent,
    NotifyComponent
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    IonicStorageModule.forRoot()
  ],
  providers: [
    PopoverController,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    InterceptService,
    ApiService,
    JsonService,
    SqlitePlureService,
    GeneralService,
    LoadingComponent,
    AlertsComponent,
    IonicStorageModule,
    Device,
    AppVersion,
    OfflineService,
    SyncerpService,
    FileChooser,
    FilePath,
    ScreenOrientation, {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy
    },
    Stripe,
    NotifyComponent,
    NotifyService,
    UserService,
    WmsService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule {}
