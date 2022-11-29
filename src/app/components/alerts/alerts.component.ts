import { Component, OnInit } from '@angular/core';
import { getDefaultSettings } from 'http2';
import { BrowserStack } from 'protractor/built/driverProviders';
import { InterceptService } from '@svc/intercept.service';
import { JsonService } from '@svc/json.service';
import { NavigationExtras, Router } from '@angular/router';
import { WmsService } from '@svc/wms.service';
import { ModalController } from '@ionic/angular';
import { EditPutAwayComponent } from '@prv/components/edit-put-away/edit-put-away.component';
import { Storage } from '@ionic/storage';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';


@Component({
  selector: 'alert-message',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss']
})
export class AlertsComponent implements OnInit {
  alertObj: any = {};
  testBool: boolean = false;
  public warePW: any = {};
  
  public whsePutAway: any;
  constructor(
     private intServ: InterceptService
    , private js: JsonService, private router: Router,private wmsService: WmsService,private modalCtrl: ModalController,
    private storage: Storage, private barcodeScanner: BarcodeScanner
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
    if ( this.alertObj.func !== undefined && this.alertObj.type !== 'confirm' && this.alertObj.type !== 'continue' && this.alertObj.type !== 'select' && this.alertObj.type !== 'register' &&  this.alertObj.type !== 'alert2' && this.alertObj.type !== 'confirmEdit')

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

No(){

       
  this.barcodeScanner.scan().then(
    async  (barCodeData) => {
       let code = barCodeData.text;

      let binCode =  this.wmsService.getBin();
  
      console.log(binCode);

        if(binCode.toUpperCase() === code.toUpperCase()){

          this.intServ.alertFunc(this.js.getAlert('success', ' ', `The filtered liecense plates if they belong to the bin code ${code.toUpperCase()}`, () => {

            this.wmsService.set('edit');
          }));
      
        }else{

          this.wmsService.set('edit');
          this.intServ.alertFunc(this.js.getAlert('error',' ',  `The filtered liecense plates do not belong to bin code  ${code.toUpperCase()}`));
           
         
        }
      }
    ).catch(
      err => {
        console.log(err);
      }
    )

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

si(){
  this.alertObj.func();
  this.alertObj = {};
}

cancel(){

  this.alertObj = {};
}

  async onSi(){

    this.intServ.loadingFunc(true);
       let dataPw = this.wmsService.getPutAway();

       console.log('put away',dataPw);

       let listWP = await this.wmsService.GetWarehousePutAway(dataPw.Warehouse_Activity_No);

       this.whsePutAway = await this.wmsService.ListPutAwayH(listWP);
   
       this.storage.set('setPutAway',listWP);


         let whsePutAway = this.whsePutAway;

       this.alertObj = {};


       this.storage.set('whsePutAway',whsePutAway)

       this.router.navigate(['page/wms/wmsPutAway']);

    
    }

}
