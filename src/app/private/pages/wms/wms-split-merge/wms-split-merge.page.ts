import { Component, OnInit } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { PopoverController } from '@ionic/angular';
import { PopoverMergeComponent } from '@prv/components/popover-merge/popover-merge.component';
import { PopoverSplitComponent } from '@prv/components/popover-split/popover-split.component';
import { InterceptService } from '@svc/intercept.service';
import { JsonService } from '@svc/json.service';
import { WmsService } from '@svc/wms.service';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-wms-split-merge',
  templateUrl: './wms-split-merge.page.html',
  styleUrls: ['./wms-split-merge.page.scss'],
})
export class WmsSplitMergePage implements OnInit {

  public lp:any = undefined;

  public palletH:any = undefined;
  public palletL:any[] = [];

  constructor( private barcodeScanner: BarcodeScanner, public popoverController: PopoverController, private wmsService:WmsService,
    private intServ: InterceptService,  private js: JsonService) { }

  ngOnInit() {
  }


  onFilter(e){

    console.log(e.target.value);



  }


  public onBarCode() {

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

          if(this.lp.fields.PLULicensePlateStatus !== 'Stored') throw Error('The license plate to scan must be in storage');

          if(this.lp.fields.PLULPDocumentType === 'Single'){

            this.lp.fields.PLUBinCode = lpH.fields.PLUBinCode;
            this.lp.fields.PLUZoneCode = lpH.fields.PLUZoneCode;
            this.lp.fields.PLULocationCode = lpH.fields.PLULocationCode;
  
            this.lp.fields.PLUReferenceDocument =  lpH.fields.PLUReferenceDocument
            this.lp.fields.PLUUnitofMeasure =  lpH.fields.PLUUnitofMeasure;
  
            
            
  
            console.log(this.lp);
  
            this.intServ.loadingFunc(false);

          }else{


            this.palletH = await this.wmsService.PalletH(lp);

            this.palletL = await this.wmsService.PalletL(lp);

            console.log(this.palletH);

            console.log(this.palletL);

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

  onSubmit(){


    console.log('guardado');
  }


 async popoverSplit(ev){


    const popover = await this.popoverController.create({
      component: PopoverSplitComponent,
      cssClass: 'popoverSplitComponent',
      event: ev,
      translucent: true,
      componentProps: {}
    });
    await popover.present();

    const { data } = await popover.onDidDismiss();


  }


 async popoverMerge(ev){

    const popover = await this.popoverController.create({
      component: PopoverMergeComponent,
      cssClass: 'popoverSplitComponent',
      event: ev,
      translucent: true,
      componentProps: {}
    });
    await popover.present();

    const { data } = await popover.onDidDismiss();

  }

}
