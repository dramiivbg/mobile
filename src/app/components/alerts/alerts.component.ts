import { Component, OnInit } from '@angular/core';
import { getDefaultSettings } from 'http2';
import { BrowserStack } from 'protractor/built/driverProviders';
import { InterceptService } from '@svc/intercept.service';
import { JsonService } from '@svc/json.service';
import { NavigationExtras, Router } from '@angular/router';
import { WmsService } from '@svc/wms.service';

@Component({
  selector: 'alert-message',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss']
})
export class AlertsComponent implements OnInit {
  alertObj: any = {};
  testBool: boolean = false;

  constructor(
     private intServ: InterceptService
    , private js: JsonService, private router: Router,private wmsService: WmsService
  ) { 
    intServ.alert$.subscribe(
      (obj: any) => {
        this.alertObj = obj;
      }
    )
  }

  ngOnInit() {
  }

  // Ok - hide alert
  onOk() {
    if ( this.alertObj.func !== undefined && this.alertObj.type !== 'confirm' && this.alertObj.type !== 'continue' && this.alertObj.type !== 'select')
      this.alertObj.func();
    this.alertObj = {};
  }

  onYes() {
    this.alertObj.func();
    this.alertObj = {};
  }

  onNo(){



    this.alertObj.func();
  this.alertObj = {};

 

}

onLp(opcion:Boolean){

  this.alertObj.func(opcion);
  this.alertObj = {};


}


onItem(opcion:Boolean){


  this.alertObj.func(opcion);
  this.alertObj = {};
}

   

  async onSi(){


       this.intServ.loadingFunc(true);


       let dataPw = this.wmsService.getPutAway();

       let listWP = await this.wmsService.GetWarehousePutAway(dataPw.Warehouse_Activity_No);


       console.log('listPW', listWP);

        let wareReceipts = this.wmsService.get();
        let navg: NavigationExtras = {
          state: {
            listWP
          },
          replaceUrl: true
        }
     

        this.router.navigate(['page/wms/wmsReceiptEdit'], navg);

        this.alertObj = {};
 


  }

}
