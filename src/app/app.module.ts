import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { InterceptService } from './shared/services/intercept.service';
import { ApiService } from './shared/services/api.service';
import { HttpClientModule } from '@angular/common/http';
import { JsonService } from './shared/services/json.service';
import { MenuService } from './data/menu.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/compiler';
import { SearchComponent } from './components/search/search.component';
import { LoadingComponent } from './components/loading/loading.component';
import { AlertsComponent } from './components/alerts/alerts.component';
import { SqlitePlureService } from './shared/services/sqlite-plure.service';
import { IonicStorageModule } from '@ionic/storage';
import { GeneralService } from './shared/services/general.service';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Device } from '@ionic-native/device/ngx'

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
    Device
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule {}
