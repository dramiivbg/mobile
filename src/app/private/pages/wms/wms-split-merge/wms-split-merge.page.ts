import { Component, OnInit, ViewChild } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ModalController, PopoverController } from '@ionic/angular';
import { OptionsLpsOrItemsComponent } from '@prv/components/options-lps-or-items/options-lps-or-items.component';
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

  public lps:any[] = [];

  public listLp:any[] = [];

  public listPallet:any[] = [];

  public pallets:any[] = [];

  public palletsL:any[] = [];

  public palletH:any = undefined;
  public palletL:any[] = [];

  constructor( private barcodeScanner: BarcodeScanner, public popoverController: PopoverController, private wmsService:WmsService,
    private intServ: InterceptService,  private js: JsonService, private modalCtrl: ModalController) { }

  ngOnInit() {
  }


  onFilter(e){

    let val = e.target.value;


    if (val === '') {
      this.lps = this.listLp;
      this.pallets = this.listPallet;
    } else {
      this.lps = this.listLp.filter(
        x => {
           return (x.fields.PLULPDocumentNo.toLowerCase().includes(val.toLowerCase()));

          });

      this.pallets = this.listPallet.filter(
           x => {
            return (x.fields.PLULPDocumentNo.toLowerCase().includes(val.toLowerCase()));

          });
     

  
  }

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

          let line =  this.lps.find(lp => lp.fields.PLULPDocumentNo === this.lp.fields.PLULPDocumentNo);

          if(line === undefined || line === null){

            this.lps.push(this.lp);
            this.listLp.push(this.lp);

          }
            
  
            
            
  
            console.log(this.lp);
  
            this.intServ.loadingFunc(false);

          }else{


            this.palletH = await this.wmsService.PalletH(lp);

            let line =  this.pallets.find(pallet => pallet.fields.PLULPDocumentNo === this.palletH.fields.PLULPDocumentNo);

            if(line === undefined || line === null){
  
              this.pallets.push(this.palletH);
              this.listPallet.push(this.palletH);

              this.palletL = await this.wmsService.PalletL(lp);

              this.palletsL[this.palletH.fields.PLULPDocumentNo] = this.palletL;
  
            }
              

        

             console.log(this.palletsL);

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


 async popoverSplit(lp:any,ev){


    const popover = await this.popoverController.create({
      component: PopoverSplitComponent,
      cssClass: 'popoverSplitComponent',
      event: ev,
      translucent: true,
      componentProps: {lp}
    });
    await popover.present();

    const { data } = await popover.onDidDismiss();


    if(data.data == 'split'){

      this.intServ.loadingFunc(true);

      try {

        lp = await this.wmsService.getLpNo(data.obj.toUpperCase());

      if(!lp.Error){

        let lpH = await this.wmsService.ListLpH(lp);
        this.lp = await this.wmsService.ListLp(lp);

        this.lp.fields.PLUBinCode = lpH.fields.PLUBinCode;
        this.lp.fields.PLUZoneCode = lpH.fields.PLUZoneCode;
        this.lp.fields.PLULocationCode = lpH.fields.PLULocationCode;
  
        this.lp.fields.PLUReferenceDocument =  lpH.fields.PLUReferenceDocument
        this.lp.fields.PLUUnitofMeasure =  lpH.fields.PLUUnitofMeasure;
  
        this.lps.filter(lp => {


          if(lp.fields.PLULPDocumentNo  === this.lp.fields.PLULPDocumentNo){


            lp.fields.PLUQuantity = this.lp.fields.PLUQuantity;
          }
      
      });

      this.intServ.loadingFunc(false);

      }else{

        this.lps.filter((lp,index) => {

          if(lp.fields.PLUBinCode === data.obj.toUpperCase()){

            this.lps.splice(index,1);

          }
        });

        this.intServ.loadingFunc(false);
        
      }
    
  
              
      } catch (error) {
        

        this.intServ.loadingFunc(false);
      }
        }

  }


 async popoverMerge(lp:any,ev){

    const popover = await this.popoverController.create({
      component: PopoverMergeComponent,
      cssClass: 'popoverSplitComponent',
      event: ev,
      translucent: true,
      componentProps: {lp}
    });
    await popover.present();

    const { data } = await popover.onDidDismiss();

  }

 async option(pallet:any,ev){


  
  let lines = this.palletsL[pallet.fields.PLULPDocumentNo];

  let No = pallet.fields.PLULPDocumentNo;


  const modal = await this.modalCtrl.create({
    component: OptionsLpsOrItemsComponent,
    componentProps: {lists:lines,No}

  
  });
  modal.present();

  const { data, role } = await modal.onWillDismiss();



  switch(data.data.PLUType){


    case 'LP':

      this.intServ.loadingFunc(true);

      let palletN = await this.wmsService.GenerateEmptyLP(pallet.fields.PLUZoneCode,pallet.fields.PLULocationCode,"",'Pallet');


     
      let obj = {

          OldLPPalletCode: pallet.fields.PLULPDocumentNo,
          NewLPPalletCode: palletN.LPNo,
          LPChildSingleCode: data.data.PLUNo
      }

      try {

        let res = await this.wmsService.SplitPallet_LPSingle(obj);

        console.log(res);

        if(res.Error) throw new Error(res.Error.Message);
        
        console.log(res);
        
        this.intServ.loadingFunc(false);
        this.intServ.alertFunc(this.js.getAlert('success', '', `The license plate ${data.data.PLUNo} has been removed from the pallet ${pallet.fields.PLULPDocumentNo} to the pallet
         ${palletN.LPNo}`));

         this.intServ.loadingFunc(true);
         let lp = await this.wmsService.getLpNo(pallet.fields.PLULPDocumentNo.toUpperCase());

         if(!lp.Error){

          this.palletL = await this.wmsService.PalletL(lp);
 
         this.palletsL[pallet.fields.PLULPDocumentNo] = this.palletL;

         this.intServ.loadingFunc(false);
         
         
         }else{

          this.pallets.filter((Pallet,index) => {

            if(Pallet.fields.PLULPDocumentNo === pallet.fields.PLULPDocumentNo){

              this.pallets.splice(index,1);
              
            }
          });

          if(this.pallets.length === 0){
            this.palletH = undefined;
          }

          this.intServ.loadingFunc(false);
         }
      



      } catch (error) {

        this.intServ.loadingFunc(false);
        this.intServ.alertFunc(this.js.getAlert('error','', error.message));
        
      }

     
      break;

    case 'Item':



      break;
     



    }

  

  }

async  popoverMergeP(pallet:any,ev){


  }


 



}
