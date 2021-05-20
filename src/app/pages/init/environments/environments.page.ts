import { ThrowStmt } from '@angular/compiler';
import { typeWithParameters } from '@angular/compiler/src/render3/util';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '@env/environment';
import { Storage } from '@ionic/storage';
import { Device } from '@ionic-native/device/ngx'
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

// import services
import { InterceptService } from '@svc/intercept.service';
import { ApiService } from '@svc/api.service';
import { JsonService } from '@svc/json.service';
import { SqlitePlureService } from '@svc/sqlite-plure.service';

// import vars
import { SK_AUTHORIZE_ACCESS_CLIENT, SK_SESSION_CUSTOMER_ID } from '@var/consts';


@Component({
  selector: 'app-enviroments',
  templateUrl: './environments.page.html',
  styleUrls: ['./environments.page.scss']
})
export class EnvironmentsPage implements OnInit {
  frm: FormGroup;

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
  ) { 
    this.frm = this.formBuilder.group(
      {
        CustomerId: ['', Validators.required]
      }
    );        
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
      console.log(error);
      this.intServ.alertFunc(this.jsonServ.getAlert('alert', 'Error', `${JSON.stringify(error)}`));
      this.intServ.loadingFunc(false);
    });
  }

  onSubmit() {
    this.intServ.loadingFunc(true);
    if ( this.frm.valid ) {
      this.jsonServ.formToJson(this.frm).then(
        formJson => {
          this.authororizeAccessClient(this.frm.value.CustomerId);
        }
      )
    } else {
      this.intServ.alertFunc(this.jsonServ.getAlert('alert', 'Alert', `You customerId '${this.frm.controls.CustomerId.value}' is not found.`));
      this.intServ.loadingFunc(false);
    }
  }

  async onReadQR(): Promise<void> {
    await this.barcodeScanner.scan().then(
      async barCodeData => {
        let customerId = barCodeData.text;
        if (customerId !== "") {
          this.intServ.loadingFunc(true);
          await this.authororizeAccessClient(customerId);
          this.intServ.loadingFunc(false);
        }
      }
    ).catch(
      err => {
        console.log(err);
        this.intServ.loadingFunc(false);
      }
    )
  }

}
