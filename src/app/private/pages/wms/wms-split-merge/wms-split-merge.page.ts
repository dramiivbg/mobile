import { Component, OnInit, ViewChild } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ModalController, PopoverController } from '@ionic/angular';
import { OptionsLpsOrItemsComponent } from '@prv/components/options-lps-or-items/options-lps-or-items.component';
import { PopoverMergeComponent } from '@prv/components/popover-merge/popover-merge.component';
import { PopoverSelectPalletComponent } from '@prv/components/popover-select-pallet/popover-select-pallet.component';
import { PopoverSplitComponent } from '@prv/components/popover-split/popover-split.component';
import { SplitItemComponent } from '@prv/components/split-item/split-item.component';
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

  public lp: any = undefined;

  public lps: any[] = [];

  public listLp: any[] = [];

  public listPicture: any[] = [];

  public listPallet: any[] = [];

  public pallets: any[] = [];

  public LPNo: any = '';

  public palletsL: any[] = [];

  public listImagenesP: any[] = [];

  public show: boolean = false;

  public palletH: any = undefined;
  public palletL: any[] = [];

  public image: Boolean = false;

  constructor(private barcodeScanner: BarcodeScanner, public popoverController: PopoverController, private wmsService: WmsService,
    private intServ: InterceptService, private js: JsonService, private modalCtrl: ModalController) { }

  ngOnInit() {
  }


  onFilter(e, lPNo: any = '') {

    switch (lPNo) {

      case '':
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
      default:
        this.lps = this.listLp.filter(
          x => {
            return (x.fields.PLULPDocumentNo.toLowerCase().includes(lPNo.toLowerCase()));

          });

        this.pallets = this.listPallet.filter(
          x => {
            return (x.fields.PLULPDocumentNo.toLowerCase().includes(lPNo.toLowerCase()));

          });


    }


  }

  onShow() {


    this.show = !this.show;
  }


  autoComplet() {

    this.barcodeScanner.scan().then(
      async (barCodeData) => {
        let code = barCodeData.text;



        this.LPNo = code;


        this.onFilter('', this.LPNo);



      }
    ).catch(
      err => {
        console.log(err);
      }
    )

  }



  public onBarCode() {

    let lp;

    this.barcodeScanner.scan().then(
      async (barCodeData) => {
        let No = barCodeData.text;


        this.intServ.loadingFunc(true);

        try {

          lp = await this.wmsService.getLpNo(No.toUpperCase());

          console.log(lp);


          if (lp.Error) throw Error(lp.Error.Message);

          if (lp.message) throw new Error(lp.message);


          let lpH = await this.wmsService.ListLpH(lp);
          this.lp = await this.wmsService.ListLp(lp);

          if (lpH.fields.PLULicensePlateStatus !== "Stored") throw Error('The license plate to scan must be in storage');

          this.lps = [];
          this.pallets = [];

          if (this.lp.fields.PLULPDocumentType === "Single") {

            this.lp.fields.PLUBinCode = lpH.fields.PLUBinCode;
            this.lp.fields.PLUZoneCode = lpH.fields.PLUZoneCode;
            this.lp.fields.PLULocationCode = lpH.fields.PLULocationCode;

            this.lp.fields.PLUReferenceDocument = lpH.fields.PLUReferenceDocument
            this.lp.fields.PLUUnitofMeasure = lpH.fields.PLUUnitofMeasure;

            let line = this.lps.find(lp => lp.fields.PLULPDocumentNo === this.lp.fields.PLULPDocumentNo);

            if (line === undefined || line === null) {

              this.lps.push(this.lp);
              this.listLp.push(this.lp);

              let item = await this.wmsService.GetItem(this.lp.fields.PLUNo);

              let listI = await this.wmsService.listItem(item);

              listI.fields.Picture = `data:image/jpeg;base64,${listI.fields.Picture}`;

              this.listPicture.push(listI);

              console.log(this.listPicture);

            }





            console.log(this.lp);

            this.intServ.loadingFunc(false);

          } else {


            this.palletH = await this.wmsService.PalletH(lp);

            let line = this.pallets.find(pallet => pallet.fields.PLULPDocumentNo === this.palletH.fields.PLULPDocumentNo);

            if (line === undefined || line === null) {

              this.pallets.push(this.palletH);
              this.listPallet.push(this.palletH);

              this.palletL = await this.wmsService.PalletL(lp);

              this.palletsL[this.palletH.fields.PLULPDocumentNo] = this.palletL;

              this.palletsL[this.palletH.fields.PLULPDocumentNo].filter(async (lp) => {


                lp = await this.wmsService.getLpNo(lp.PLUNo);

                this.lp = await this.wmsService.ListLp(lp);

                let item = await this.wmsService.GetItem(this.lp.fields.PLUNo);

                let listI = await this.wmsService.listItem(item);

                listI.fields.Picture = `data:image/jpeg;base64,${listI.fields.Picture}`;

                this.listImagenesP.push(listI);

                console.log(this.listImagenesP);



              });

            }




            console.log(this.palletsL);

            this.intServ.loadingFunc(false);

          }



        } catch (error) {

          this.intServ.loadingFunc(false);

          this.intServ.alertFunc(this.js.getAlert('error', ' ', error.message));

        }
      }
    ).catch(
      err => {
        console.log(err);
      }
    )
  }


 async  newLPSingle(){

  try {

    this.intServ.loadingFunc(true);
    let res = await this.wmsService.GenerateEmptyLP("STO", "NEWWMS", "", 'Single');
  
    if(res.Error) throw new Error(res.Error.Message);
    if(res.error) throw new Error(res.error.message);
    if(res.message) throw new Error(res.message);
  
    this.intServ.loadingFunc(false);
    this.intServ.alertFunc(this.js.getAlert('success', '', `The LP Single ${res.LPNo} was created`));
    
  } catch (error) {
    this.intServ.loadingFunc(false);
    this.intServ.alertFunc(this.js.getAlert('error', '', error.message));
  }
  }

  async popoverSplit(lp: any, ev) {

    let resS;
    try {
       resS = await this.wmsService.GetLPArrayByStatus(false,0);
      if(resS.Error) throw new Error(resS.Error.Message);
      if(resS.error) throw new Error(resS.error.message);
      
      
    } catch (error) {
      return this.intServ.alertFunc(this.js.getAlert('alert', error.message,'Please create an empty LP single in the drop-down button below. '));
    
    }
   
    let listSingleVoid = await this.wmsService.listPalletVoid(resS.LicensePlates.LPHeaders);
  

    const popover = await this.popoverController.create({
      component: PopoverSplitComponent,
      cssClass: 'popoverSplitComponent',
      backdropDismiss: false,
      componentProps: { lp,listSingleVoid }
    });
    await popover.present();

    const { data } = await popover.onDidDismiss();


    if(data.qty != undefined){
         
      this.intServ.loadingFunc(true);
      try {
  
        let qty = lp.fields.PLUQuantity -  data.qty;
  
        let lpO = lp.fields.PLULPDocumentNo;
  
        let objP =   {
         NewLicensePlateCode: data.lpNo,
          NewQuantity:  data.qty,
          OriginalQuantityModified: qty,
          OriginalLicensePlateCode: lpO
        };
  
  
        let res = await this.wmsService.SplitLPSingle_Item(objP);

        console.log(res);

        if(res.Error) throw new Error(res.Error.Message);

        if(res.error) throw new Error(res.error.message);
        
        this.intServ.loadingFunc(false);
        this.intServ.alertFunc( this.js.getAlert('success', '', `Has been successfully created the License Plate Single ${data.lpNo}`, () => {
          this.lps = [];
          this.lp = undefined;
        }));

        
      } catch (error) {
     
        this.intServ.loadingFunc(false);
        this.intServ.alertFunc( this.js.getAlert('error', '', error.message));
              
      }
    }

  }


  public UploadI() {

    this.image = true;
  }

  public RemoveI() {

    this.image = false;
  }


  async popoverMerge(lp: any, ev) {

    const popover = await this.popoverController.create({
      component: PopoverMergeComponent,
      cssClass: 'popoverMergeComponent',
      backdropDismiss: false,
      componentProps: { lp }
    });
    await popover.present();

    const { data } = await popover.onDidDismiss();


    if (data.lpNo !== undefined) {

      this.intServ.loadingFunc(true);

      try {

        let res = await this.wmsService.MergeLPSingle(data.lpNo,lp.fields.PLULPDocumentNo);
      
        if(res.Error) throw new Error(res.Error.Message);
      
        if(res.error) throw new Error(res.error.message);
        
  
        this.intServ.loadingFunc(false);
        this.intServ.alertFunc(this.js.getAlert('success', '', `The license plate single ${data.lpNo} has been successfully joined to the LP single ${this.lp.fields.PLULPDocumentNo}`, () => {
          this.lps = [];
          this.lp = undefined;
        }));
     
        
      } catch (error) {
      
      this.intServ.loadingFunc(false);
      this.intServ.alertFunc(this.js.getAlert('error','', error.message));
        
      }
   
    }

  }

 async newPallet(){

try {

  this.intServ.loadingFunc(true);
  let res = await this.wmsService.GenerateEmptyLP("STO", "NEWWMS", "", 'Pallet');

  if(res.Error) throw new Error(res.Error.Message);
  if(res.error) throw new Error(res.error.message);
  if(res.message) throw new Error(res.message);

  this.intServ.loadingFunc(false);
  this.intServ.alertFunc(this.js.getAlert('success', '', `The pallet ${res.LPNo} was created`));
  
} catch (error) {
  this.intServ.loadingFunc(false);
  this.intServ.alertFunc(this.js.getAlert('error', '', error.message));
}


  }

  async option(pallet: any, ev) {



    let lines = this.palletsL[pallet.fields.PLULPDocumentNo];

    let No = pallet.fields.PLULPDocumentNo;


    const modal = await this.modalCtrl.create({
      component: OptionsLpsOrItemsComponent,
      componentProps: { lists: lines, No }


    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

  let single = data.data;


    switch (data.data.PLUType) {


      case 'LP':

      let resP;

      try {
        resP = await this.wmsService.GetLPArrayByStatus(true,0);
        if(resP.Error) throw new Error(resP.Error.Message);
        if(resP.error) throw new Error(resP.error.message);
        
        
      } catch (error) {
        
       return this.intServ.alertFunc(this.js.getAlert('alert', error.message,'Please create an empty Pallet in the drop-down button below. '));
        
      }
    
    
      let listPalletVoid = await this.wmsService.listPalletVoid(resP.LicensePlates.LPHeaders);
      const popover = await this.popoverController.create({
        component: PopoverSelectPalletComponent,
        cssClass: "PopoverSelectPalletComponent",
        componentProps: {pallet,single, listPalletVoid},
        backdropDismiss: false
      
      });
      popover.present();

      const { data} = await popover.onWillDismiss();


    if(data.palletNo != undefined){
      
      this.intServ.loadingFunc(true);
      let obj = {

        OldLPPalletCode: pallet.fields.PLULPDocumentNo,
        NewLPPalletCode: data.palletNo,
        LPChildSingleCode: single.PLUNo
      }

      try {

        let res = await this.wmsService.SplitPallet_LPSingle(obj);

        console.log(res);

        if (res.Error) throw new Error(res.Error.Message);
        if(res.error) throw new Error(res.error.message);

        
        console.log(res);

        this.intServ.loadingFunc(false);
        this.intServ.alertFunc(this.js.getAlert('success', '', `The license plate ${single.PLUNo} has been removed from the pallet ${pallet.fields.PLULPDocumentNo} to the pallet
       ${data.palletNo}`, async() => {
        this.pallets = [];
        this.palletH = undefined

      }));

      } catch (error) {

        this.intServ.loadingFunc(false);
        this.intServ.alertFunc(this.js.getAlert('error', '', error.message));

      }
    }

     

        break;

      case 'Item':

        let res = await this.splitQ(data.data, pallet);

        if (res.data === 'split') {


          this.intServ.loadingFunc(true);

          let lp = await this.wmsService.getLpNo(pallet.fields.PLULPDocumentNo.toUpperCase());


          if (!lp.Error) {

            this.palletL = await this.wmsService.PalletL(lp);

            this.palletsL[pallet.fields.PLULPDocumentNo] = this.palletL;

            this.intServ.loadingFunc(false);


          } else {

            this.pallets.filter((Pallet, index) => {

              if (Pallet.fields.PLULPDocumentNo === pallet.fields.PLULPDocumentNo) {

                this.pallets.splice(index, 1);

              }
            });

            if (this.pallets.length === 0) {
              this.palletH = undefined;
            }

            this.intServ.loadingFunc(false);
          }




        }



        break;




    }



  }

  async popoverMergeP(pallet: any, ev) {


  }




  async splitQ(item: any, pallet: any) {

    const popover = await this.popoverController.create({
      component: SplitItemComponent,
      cssClass: ' splitItemComponent',
      translucent: true,
      componentProps: { item, pallet }
    });
    await popover.present();

    const { data } = await popover.onDidDismiss();


    return data;

  }


}