import { Component, OnInit } from '@angular/core';
import { getDefaultSettings } from 'http2';
import { BrowserStack } from 'protractor/built/driverProviders';
import { InterceptService } from '@svc/intercept.service';
import { JsonService } from '@svc/json.service';
import { NavigationExtras, Router } from '@angular/router';
import { WmsService } from '@svc/wms.service';
import { ModalController } from '@ionic/angular';
import { EditPutAwayComponent } from '@prv/components/edit-put-away/edit-put-away.component';



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
    , private js: JsonService, private router: Router,private wmsService: WmsService,private modalCtrl: ModalController
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
    if ( this.alertObj.func !== undefined && this.alertObj.type !== 'confirm' && this.alertObj.type !== 'continue' && this.alertObj.type !== 'select' && this.alertObj.type !== 'register')
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

       let dataPw = this.wmsService.getPutAway();

       let listWP = await this.wmsService.GetWarehousePutAway(dataPw.Warehouse_Activity_No);

       this.whsePutAway = await this.wmsService.ListPutAwayH(listWP);
   
       this.wmsService.setPutAway(listWP);


         let whsePutAway = this.whsePutAway;

       this.alertObj = {};

        const modal = await this.modalCtrl.create({
          component: EditPutAwayComponent,
          componentProps: {whsePutAway}
      
        
        });
        modal.present();
    
        const { data, role } = await modal.onWillDismiss();
    
    }

}
