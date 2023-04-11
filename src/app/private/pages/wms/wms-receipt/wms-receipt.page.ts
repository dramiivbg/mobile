import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ActionSheetController, AlertController, IonThumbnail, ModalController, PopoverController } from '@ionic/angular';
import { Process } from '@mdl/module';
import { PopoverOptionsComponent } from '@prv/components/popover-options/popover-options.component';
import { GeneralService } from '@svc/general.service';
import { ModuleService } from '@svc/gui/module.service';
import { InterceptService } from '@svc/intercept.service';
import { JsonService } from '@svc/json.service';
import { SyncerpService } from '@svc/syncerp.service';
import { WmsService } from '@svc/wms.service';

import { LicensePlatesComponent } from '../license-plates/license-plates.component';

import { PopoverLpsComponent } from '../../../components/popover-lps/popover-lps.component';
import { ELOOP, S_IFREG } from 'constants';
import { Key } from 'protractor';
import { SqlitePlureService } from '@svc/sqlite-plure.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { PopoverNewPalletComponent } from '@prv/components/popover-new-pallet/popover-new-pallet.component';
import { typeWithParameters } from '@angular/compiler/src/render3/util';
import { ListPalletComponent } from '@prv/components/list-pallet/list-pallet.component';

import { Storage } from '@ionic/storage';
import { UpdateItemComponent } from '@prv/components/update-item/update-item.component';
import { PopoverItemTrakingComponent } from '@prv/components/popover-item-traking/popover-item-traking.component';

@Component({
  selector: 'app-wms-receipt',
  templateUrl: './wms-receipt.page.html',
  styleUrls: ['./wms-receipt.page.scss'],
  providers: [
    PopoverController
  ]
})
export class WmsReceiptPage implements OnInit {
  public wareReceipts: any = {};
  public btnExample: boolean = false;
  private module: any = {};
  private process: Process;
  private routExtras: any;

  private list: any = [];

  private LpL: any = [];

  public seriales:any[] = [];

  public items:any[] = [];


  public cantidades: number[] = [];

  constructor(private wmsService: WmsService
    , private intServ: InterceptService
    , private js: JsonService
    , private router: Router
    , private moduleService: ModuleService
    , private general: GeneralService
    , private barcodeScanner: BarcodeScanner
    , public popoverController: PopoverController
    , private interceptService: InterceptService
    , private jsonService: JsonService
    ,private storage: Storage,


  ) {
    let objFunc = {
      func: () => {
        this.onBack();
      }
    };
    this.intServ.appBackFunc(objFunc);
   

  }

  public async ngOnInit() {

    this.getReceipt();
  }



  /**
  * Return to the modules.
  */
  public onBack() {
    this.router.navigate(['page/main/modules'], { replaceUrl: true });
  }

  /**
   * bar camera
   */
  public onBarCode() {
    this.barcodeScanner.scan().then(
      barCodeData => {
        let code = barCodeData.text;
        let line = this.wareReceipts.lines.find(x => x.ItemNo === code);
        if (line === null || line === undefined) {
          this.intServ.alertFunc(this.js.getAlert('error', ' ', `The item '${code}' does not exist on this receipt`));
        } else {
          console.log(line);
        }
      }
    ).catch(
      err => {
        console.log(err);
      }
    )
  }

  public async onPopoverMenu(ev: any, item: any) {
    this.intServ.loadingFunc(true);
   
    switch (item.Managed_by_PlurE) {
      case true:
        this.intServ.loadingFunc(false);    
          this.onPopLicensePlates(ev, item);
        break;

      default:
        let lp = await this.wmsService.getPendingToReceiveLP(item.No, item.ItemNo, item.UnitofMeasureCode, item.BinCode);
        let lstUoM = await this.wmsService.getUnitOfMeasure(item.ItemNo);

      if(item.ItemTrackingCode === ""){

        console.log('Bincode =>', item.BinCode);
        this.intServ.loadingFunc(false);
        const popoverI = await this.popoverController.create({
          component: UpdateItemComponent,
          cssClass: 'UpdateItemComponent',
          componentProps: { options: { item, lp, lstUoM } },
        });
       await popoverI.present();

       const { data } = await popoverI.onDidDismiss();

       if(data.receive) this.getReceipt();
        break;
      }else{
        this.popoverItemTraking(item,lp);
        break;
      }
      
       
    }

  }


  public async onPopoverPl(items: any) {

    this.intServ.loadingFunc(false);
    const popover = await this.popoverController.create({
      component: PopoverLpsComponent,
      cssClass: 'popoverPls',
      backdropDismiss: false,
      componentProps: { lps: items }

    });
    await popover.present();

    const { data } = await popover.onDidDismiss();

    if (data != undefined) {
      if (data.data == 'eliminado') {
        this.getReceipt();
      }
    }

  }


  public async popoverItemTraking(item:any,lp:any){
    let res = await this.wmsService.GetItemTrackingSpecificationV2(item.ItemNo,item.SourceNo,item.SourceLineNo);

      console.log(res);
    
    let trakingOpen = (res.ItemTrackingOpenJO.Error === undefined)?await this.wmsService.listTraking(res.ItemTrackingOpenJO.TrackingSpecificationOpen):[];
    let trakingClose = (res.ItemTrackinCloseJO.Error === undefined)?await this.wmsService.listTraking(res.ItemTrackinCloseJO.TrackingSpecificationClose):[];
    console.log('item =>',item);

    let code = (res.ItemTrackingJO.Error === undefined)? await this.wmsService.listCode(res.ItemTrackingJO): null;

      if(item.Auto_Generate_LOT === false && item.Auto_Generate_SN === false){

        const popover = await this.popoverController.create({
          component: PopoverItemTrakingComponent,
          cssClass: 'transparent-modal',
          componentProps: {options: { item, lp, code,trakingOpen, trakingClose} },
          backdropDismiss: false
        });
        await popover.present();
        const { data } = await popover.onDidDismiss();
        if(data.receive != item.QtytoReceive)this.getReceipt();
      }else{
        this.intServ.loadingFunc(false);
        this.intServ.alertFunc(this.js.getAlert('alert','','Lots/serials  will be generated automatically'));
      }
      
  }


  public async onPopLicensePlates(ev: any, item: any) {
    this.intServ.loadingFunc(true);

    try {
      
      let res = await this.wmsService.GetItemTrackingSpecificationV2(item.ItemNo,item.SourceNo,item.SourceLineNo);

      console.log(res);
 
    
    let trakingOpen = (res.ItemTrackingOpenJO.Error === undefined)?await this.wmsService.listTraking(res.ItemTrackingOpenJO.TrackingSpecificationOpen):[];
    let trakingClose = (res.ItemTrackinCloseJO.Error === undefined)?await this.wmsService.listTraking(res.ItemTrackinCloseJO.TrackingSpecificationClose):[];
    let lp = await this.wmsService.getPendingToReceiveLP(item.No, item.ItemNo, item.UnitofMeasureCode, item.BinCode);
    let code = (res.ItemTrackingJO.Error === undefined)?await this.wmsService.listCode(res.ItemTrackingJO):null;
    let lstUoM = await this.wmsService.getUnitOfMeasure(item.ItemNo);


    console.log(lp);
    console.log(item);
    if (lp.LP_Pending_To_Receive > 0) {
      const popover = await this.popoverController.create({
        component: LicensePlatesComponent,
        cssClass: 'popLicensePlate-modal',
        componentProps: { options: { item, lp, lstUoM,code,trakingClose,trakingOpen } },
        backdropDismiss: false
      });
      this.intServ.loadingFunc(false);
      await popover.present();
      const { data } = await popover.onDidDismiss();

      if (data.data == 'creado') {
        this.getReceipt();
      }
    } else {

      this.interceptService.loadingFunc(false);
      this.interceptService.alertFunc(this.jsonService.getAlert('alert', ' ', 'You have created all the LP Pending To Receive'))
    }

    } catch (error) {
   
    }
    
    
  }

  private async getReceipt() {
    this.intServ.loadingFunc(true);
    let wms = await this.storage.get('wms');
    console.log('data =>', wms);
    try {
      let receipt = await this.wmsService.getReceiptByNo(wms.id);

      if (receipt.Error) throw new Error(receipt.Error.Message);
      if(receipt.error) throw new Error(receipt.error.message);
      if(receipt.message) throw new Error(receipt.message);
    
      console.log('receiptc =>', receipt);
      this.mappingReceipt(receipt);

    } catch (error) {
      this.intServ.loadingFunc(false);
      this.intServ.alertFunc(this.js.getAlert('error', '', error.message, () => {
        return this.router.navigate(['page/wms/wmsMain']);
      }));
    }

    

  }
  /**
   * Mapping Receipts
   * @param receipt { WarehouseReceipt: {WarehouseReceiptHeader, WarehouseReceiptLines} }
   */
  private async mappingReceipt(receipt: any) {
    this.wareReceipts = await this.general.ReceiptHeaderAndLines(receipt.WarehouseReceipt);
    console.log('receipt =>', this.wareReceipts);
     this.items = receipt.WarehouseReceipt.WarehouseReceiptLines;
    this.intServ.loadingFunc(false);
 

  }

  private listMenu(item: any): any {
    return {
      options: {
        name: `PO No. ${item.SourceNo}`,
        menu: [
          {
            id: 1,
            name: 'Add',
            icon: 'newspaper-outline',
            obj: item
          },
          {
            id: 2,
            name: 'Close',
            icon: 'close-circle-outline',
            obj: {}
          }
        ]
      }
    };

  }


//muestra el contenido del  LP
  showLPs(item: any) {
    this.intServ.loadingFunc(true);
   
    this.onPopoverPl(item.LPArray.LicensePlates);
  }


  public async newPallet() {

    this.intServ.loadingFunc(true);

    let wareReceipts = this.wareReceipts;

    this.wmsService.set(this.wareReceipts);

    try {
      let pallet = await this.wmsService.CreateLPPallet_FromWarehouseReceiptLine(this.wareReceipts);

      let palletL = await this.wmsService.getLpNo(pallet.LPPallet_DocumentNo);

    if (pallet.Error) throw new Error(pallet.Error.Message);
    if (pallet.error) throw new Error(pallet.error.message);
    if (pallet.message) throw new Error(pallet.message);
   
    if (palletL.Error) throw new Error(palletL.Error.Message);
    if (palletL.error) throw new Error(palletL.error.message);
    if (palletL.message) throw new Error(palletL.message);

    console.log(palletL);
    let palletN = await this.wmsService.ListLpH(palletL);
    

      let navigationExtras: NavigationExtras = {
        state: {
          pallet: palletN,
          new: false
        },
        replaceUrl: true
      };
      this.router.navigate(['page/wms/newPallet'], navigationExtras);
    
      
    } catch (error) {
      
      this.intServ.loadingFunc(false);

      this.intServ.alertFunc(this.js.getAlert('error', ' ', error.message));
    }
  

  }



  async listPallet() {

    this.intServ.loadingFunc(true);
    let pallets = [];

    try {



      const lpsP = await this.wmsService.GetLicencesPlateInWR(this.wareReceipts.No, true);


      if (lpsP.Error) throw Error(lpsP.Error.Message);
      if (lpsP.error) throw Error(lpsP.error.message);


      for (const key in lpsP.LicensePlates) {

        let pallet = await this.wmsService.listTraking(lpsP.LicensePlates[key].LPLines);
        lpsP.LicensePlates[key].LPLines = pallet
        
        if(pallet.length > 0)pallets.push(lpsP.LicensePlates[key]);
      }



      console.log('license plate pallet =>', pallets);

        let wareReceipts = this.wareReceipts;

        this.storage.set(`${this.wareReceipts.No}, pallet`, pallets);
        this.storage.set(`wareReceipt`, wareReceipts);

        this.router.navigate(['page/wms/listPallet']);

      
      

    } catch (error) {

      this.intServ.loadingFunc(false);

      this.intServ.alertFunc(this.jsonService.getAlert('alert', '', error.message));

    }


  }




  async onSubmit() {


    this.intServ.alertFunc(this.js.getAlert('confirm', '', 'Confirm Whse. Receipt?', async () => {

      this.intServ.loadingFunc(true);

      var alert = setTimeout(async () => {

        try {

          //postea el wareshouse receipt
          let postWR = await this.wmsService.Post_WarehouseReceipts(this.wareReceipts.No);

          console.log(postWR);
          if (postWR.Error) throw new Error(postWR.Error.Message);
          if (postWR.error) throw new  Error(postWR.error.message);
          if (postWR.message) throw new  Error(postWR.message);

          this.wmsService.setPutAway(postWR);

          if(postWR.Partial){
            this.getReceipt();
          }else{
            this.router.navigate(['/page/wms/wmsMain']);
          }

          if(postWR.Partial)this.items.map(x =>  this.storage.set(`${x.No} ${x.LineNo}`, 0));

          console.log('postWR', postWR);

          this.intServ.loadingFunc(false);

          this.intServ.alertFunc(this.js.getAlert('continue', '', 'Continue Process Put-Away?', () => {

            this.intServ.loadingFunc(true);

            var alert = setTimeout(() => {

              this.intServ.loadingFunc(false);

              this.intServ.alertFunc(this.js.getAlert('edit', 'If you press "No" the Put-Away will be processed by default on the floor!', 'Do you want to edit the default Put-Away?', async () => {

                this.intServ.loadingFunc(true);

                try {

                  let dataPw = this.wmsService.getPutAway();

                  //postea el wareshouse put away por default
                  let data = await this.wmsService.Post_WarehousePutAways(dataPw.Warehouse_Activity_No);

                  console.log('postWP', data);

                  if (data.Error) throw new  Error(data.Error.Message);
                  if (data.error) throw new  Error(data.error.message);
                  if (data.message) throw new  Error(data.message);

                  this.intServ.loadingFunc(false);
                  this.intServ.alertFunc(this.js.getAlert('success', '', `The put away ${dataPw.Warehouse_Activity_No} was successfully posted with the registration number ${data.Registered_Whse_Activity}`, () => {

                   if(postWR.Partial){
                    this.router.navigate(['/page/wms/wmsReceipt']);
                   }else{
                    this.router.navigate(['/page/wms/wmsMain']);
                   }
                  }))


                } catch (error) {

                  this.intServ.loadingFunc(false);
                  this.intServ.alertFunc(this.js.getAlert('error', '', error.message))

                }

              }));

              clearTimeout(alert);
            }, 100)


          }));


        } catch (error) {

          this.intServ.loadingFunc(false);

          this.intServ.alertFunc(this.js.getAlert('error', '', error.message));
        }

        clearTimeout(alert);
      }, 100)


    }));


  }

}
