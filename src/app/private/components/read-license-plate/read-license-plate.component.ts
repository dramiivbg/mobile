import { Component, OnInit } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ModalController, PopoverController } from '@ionic/angular';
import { InterceptService } from '@svc/intercept.service';
import { JsonService } from '@svc/json.service';
import { WmsService } from '@svc/wms.service';
import { PopoverLogLpComponent } from '../popover-log-lp/popover-log-lp.component';

@Component({
  selector: 'app-read-license-plate',
  templateUrl: './read-license-plate.component.html',
  styleUrls: ['./read-license-plate.component.scss'],
})
export class ReadLicensePlateComponent implements OnInit {

  public principalcontent:boolean=true;
  public lp:any;
  public lpH:any;
  public single = false;
  public pallet = false;
  constructor(private barcodeScanner: BarcodeScanner,  private intServ: InterceptService, private wmsService: WmsService,
    private js: JsonService,   private modalCtrl: ModalController ) { }

  ngOnInit() {}


  onBarCode(){

    this.barcodeScanner.scan().then(
      async(barCodeData) => {
        let No = barCodeData.text;

        this.intServ.loadingFunc(true);

        try {

         let  lp = await this.wmsService.getLpNo(No.toUpperCase());

           console.log(lp);


          if(lp.Error) throw Error(lp.Error.Message);
          this.lpH = await this.wmsService.listSetup(lp.LicensePlates.LicensePlatesHeaders);
          this.lp = await this.wmsService.listTraking(lp.LicensePlates.LicensePlatesLines);
          console.log(this.lpH,this.lp);

          this.principalcontent = false;
         this.intServ.loadingFunc(false);
      
          
        } catch (error) {

          this.intServ.loadingFunc(false);

          this.intServ.alertFunc(this.js.getAlert('error',' ' , error.message));
          
        }
      
        
      }
    ).catch(
      err => {
        console.log(err);
      }
    )


  }


  async log(No:any,ev){
    this.intServ.loadingFunc(true);
   let log = await this.wmsService.Get_LPLedgerEntries(No.toUpperCase());
   let listLogsFilter = log.LicensePlateEntries;
   let listLogs =  log.LicensePlateEntries;
   
   const modal = await this.modalCtrl.create({
    component: PopoverLogLpComponent,
    componentProps: { listLogsFilter,listLogs }

  
  });
  this.intServ.loadingFunc(false);
 await modal.present();   

  }


}
