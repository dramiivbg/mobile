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
  public lp:any = undefined;
  public palletH:any = undefined;
  public palletL:any[] = [];
  constructor(private barcodeScanner: BarcodeScanner,  private intServ: InterceptService, private wmsService: WmsService,
    private js: JsonService,   private modalCtrl: ModalController ) { }

  ngOnInit() {}


  onBarCode(){


    let lp;
    this.barcodeScanner.scan().then(
      async(barCodeData) => {
        let No = barCodeData.text;

        this.intServ.loadingFunc(true);

        try {

           lp = await this.wmsService.getLpNo(No.toUpperCase());

           console.log(lp);


          if(lp.Error) throw Error(lp.Error.Message);
          let lpH = await this.wmsService.ListLpH(lp);
          this.lp = await this.wmsService.ListLp(lp);

          if(this.lp.fields.PLULPDocumentType === 'Single'){

            this.principalcontent = false;
            this.lp.fields.PLUBinCode = lpH.fields.PLUBinCode;
            this.lp.fields.PLUZoneCode = lpH.fields.PLUZoneCode;
            this.lp.fields.PLULocationCode = lpH.fields.PLULocationCode;

            this.principalcontent = false
  
            this.lp.fields.PLUReferenceDocument =  lpH.fields.PLUReferenceDocument;
            this.lp.fields.PLUUnitofMeasure =  lpH.fields.PLUUnitofMeasure;
           
  
            
            
  
            console.log(this.lp);
  
            this.intServ.loadingFunc(false);

          }else{

            this.principalcontent = false;
            this.palletH = await this.wmsService.PalletH(lp);

            this.palletL = await this.wmsService.PalletL(lp);

            console.log(this.palletH);

            console.log(this.palletL);

            console.log(this.palletH,this.palletL);

          

            this.intServ.loadingFunc(false);

          }

      
          
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

   let log = await this.wmsService.Get_LPLedgerEntries(No.toUpperCase());


   const modal = await this.modalCtrl.create({
    component: PopoverLogLpComponent,
    componentProps: { logs: log }

  
  });
  modal.present();



    
    

  }



}
