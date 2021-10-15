import { ThrowStmt } from '@angular/compiler';
import { typeWithParameters } from '@angular/compiler/src/render3/util';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '@env/environment';
import { Storage } from '@ionic/storage';
import { Device } from '@ionic-native/device/ngx'
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';

// import services
import { InterceptService } from '@svc/intercept.service';
import { ApiService } from '@svc/api.service';
import { JsonService } from '@svc/json.service';
import { SqlitePlureService } from '@svc/sqlite-plure.service';

// import vars
import { SK_AUTHORIZE_ACCESS_CLIENT, SK_ENVIRONMENT, SK_SESSION_CUSTOMER_ID } from '@var/consts';

import { Plugins } from '@capacitor/core';
const { App } = Plugins;


@Component({
  selector: 'app-enviroments',
  templateUrl: './environments.page.html',
  styleUrls: ['./environments.page.scss']
})
export class EnvironmentsPage implements OnInit {
  frm: FormGroup;
  version: string = "";

  constructor(
    private intServ: InterceptService
    , private apiConnect: ApiService
    , private formBuilder: FormBuilder
    , private jsonServ: JsonService
    , private router: Router
    , private sqlLite: SqlitePlureService
    , private storage: Storage
    , private device: Device
    , private barcodeScanner: BarcodeScanner
    , private appVersion: AppVersion
    , private js: JsonService
  ) {
    let objBack = {
      func: () => {
        this.intServ.alertFunc(this.js.getAlert('confirm', 'Confirm', 'Do you want to close the app?',
          () => {
            App.exitApp();
          }
        ));
      }
    }
    this.intServ.appBackFunc(objBack);
    this.frm = this.formBuilder.group(
      {
        CustomerId: ['', Validators.required]
      }
    );
    this.getVersion();
  }

  ngOnInit() {
  }

  async authororizeAccessClient(customerId: string) {
    let data = {
      customerId: customerId,
      platformCode: environment.platformCode,
      uuid: this.device.uuid
    }

    await this.apiConnect.postData('mobile', 'authorizeaccessclient', data)
    .then(
      res => {
        this.intServ.loadingFunc(false);
        this.storage.set(SK_AUTHORIZE_ACCESS_CLIENT, JSON.stringify(res));
        this.router.navigateByUrl('/login', {replaceUrl: true });
      }
    )
    .catch(error => {
      error = error.error;
      this.intServ.alertFunc(this.jsonServ.getAlert('alert', 'Error', `${error.message}`));
      this.intServ.loadingFunc(false);
    });
  }

  async onSubmit() {
    this.intServ.loadingFunc(true);
    if ( this.frm.valid ) {
      let {CustomerId} = await this.jsonServ.formToJson(this.frm);
      let indexof = CustomerId.indexOf('|');
      if (indexof === -1) {
        await this.storage.set(SK_ENVIRONMENT, 'TEST');
        await this.authororizeAccessClient(CustomerId);
      } else {
        let customerSplit = CustomerId.split('|');
        await this.storage.set(SK_ENVIRONMENT, customerSplit[0]);
        await this.authororizeAccessClient(customerSplit[1]);
      }
      this.intServ.loadingFunc(false);
    } else {
      this.intServ.alertFunc(this.jsonServ.getAlert('alert', 'Alert', `You customerId '${this.frm.controls.CustomerId.value}' is not found.`));
      this.intServ.loadingFunc(false);
    }
  }

  async onReadQR(): Promise<void> {
    this.barcodeScanner.scan({
      disableSuccessBeep: true
    }).then(
      async barCodeData => {
        if (barCodeData.text !== "") {
          console.log(barCodeData.text);
          this.intServ.loadingFunc(true);
          let indexof = barCodeData.text.indexOf('|');
          if (indexof === -1) {
            await this.storage.set(SK_ENVIRONMENT, 'LIVE');
            this.authororizeAccessClient(barCodeData.text);
          } else {
            let customerSplit = barCodeData.text.split('|');
            await this.storage.set(SK_ENVIRONMENT, customerSplit[0]);
            this.authororizeAccessClient(customerSplit[1]);
          }
        }
      }
    ).catch(
      err => {
        this.intServ.loadingFunc(false);
      }
    )
  }

  getVersion(): void {
    this.appVersion.getVersionNumber().then(
      res => {
        this.version = `v${res}`;
      }
    ).catch(
      err => this.version = `v0.0`
    );
  }

}
