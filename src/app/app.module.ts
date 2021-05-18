import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MenuService } from './data/menu.service';
import { SearchComponent } from './components/search/search.component';
import { LoadingComponent } from './components/loading/loading.component';
import { AlertsComponent } from './components/alerts/alerts.component';
import { IonicStorageModule } from '@ionic/storage';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Device } from '@ionic-native/device/ngx'

// import services
import { InterceptService } from '@svc/intercept.service';
import { ApiService } from '@svc/api.service';
import { JsonService } from '@svc/json.service';
import { SqlitePlureService } from '@svc/sqlite-plure.service';
import { GeneralService } from '@svc/general.service';
import { ApiBaseUrlInterceptor } from '@svc/api-base-url-interceptor';
import { HttpErrorInterceptor } from '@svc/http-error-interceptor';

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    LoadingComponent,
    AlertsComponent
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    IonicStorageModule.forRoot()
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    InterceptService,
    ApiService,
    JsonService,
    MenuService,
    SqlitePlureService,
    GeneralService,
    SearchComponent,
    LoadingComponent,
    AlertsComponent,
    IonicStorageModule,
    BarcodeScanner,
    Device,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },    
    { provide: HTTP_INTERCEPTORS, useClass: ApiBaseUrlInterceptor, multi: true},
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true}
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule {}
