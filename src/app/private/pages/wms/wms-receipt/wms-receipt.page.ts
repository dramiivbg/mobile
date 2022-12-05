import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ActionSheetController, AlertController, ModalController, PopoverController } from '@ionic/angular';
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

  private lp: any;

  private list: any = [];

  private LpL: any = [];


  public cantidades: number[] = [];

  constructor(private wmsService: WmsService
    , private intServ: InterceptService
    , private js: JsonService
    , private route: ActivatedRoute
    , private router: Router
    , private moduleService: ModuleService
    , private general: GeneralService
    , private barcodeScanner: BarcodeScanner
    , public popoverController: PopoverController
    , private interceptService: InterceptService
    , private jsonService: JsonService
    , private sqlitePlureService: SqlitePlureService
    , private alertController: AlertController,
    private modalCtrl: ModalController,
    private storage: Storage,
   

  ) {
    let objFunc = {
      func: () => {
        this.onBack();
      }
    };
    this.intServ.appBackFunc(objFunc);

      this.getReceipt();

  }

  public async ngOnInit() {

  }

  public async ionViewWillEnter() {
    try {
      this.module = await this.moduleService.getSelectedModule();
      this.process = await this.moduleService.getSelectedProcess();
    } catch (error) {
      this.intServ.loadingFunc(false);
    }
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
    let plure = await this.wmsService.GetItemInfo(item.ItemNo);
    switch(plure.Managed_by_PlurE){
      case true:
        this.intServ.loadingFunc(false);
      const popover = await this.popoverController.create({
        component: PopoverOptionsComponent,
        cssClass: 'popoverOptions',
        componentProps: this.listMenu(item)
      });
      await popover.present();
  
      const { data } = await popover.onDidDismiss();
      if (data.data.No !== undefined) {
        this.onPopLicensePlates(ev, item);
      
    }

    break;

    default:
      let lp = await this.wmsService.getPendingToReceiveLP(item.No, item.ItemNo, item.UnitofMeasureCode, item.BinCode);
      console.log('Bincode =>', item.BinCode);
      let lstUoM = await this.wmsService.getUnitOfMeasure(item.ItemNo);
      this.intServ.loadingFunc(false);
      const popoverI = await this.popoverController.create({
        component: UpdateItemComponent,
        cssClass: 'UpdateItemComponent',
        componentProps: { options: { item, lp, lstUoM } },
      });
      await popoverI.present();
      console.log(plure); 
    

      break;
  }

}


  public async onPopoverPl(ev: any, items: any) {

    this.intServ.loadingFunc(false);
    const popover = await this.popoverController.create({
      component: PopoverLpsComponent,
      cssClass: 'popoverPls',
      backdropDismiss: true,
      componentProps: { lps: items }
      
    });
    await popover.present();

    const { data } = await popover.onDidDismiss();

  if(data != undefined){
    if(data.data == 'eliminado'){
      this.getReceipt();
    }
  }
 


  }
  public async onPopLicensePlates(ev: any, item: any) {
    this.intServ.loadingFunc(true);

    // console.log(item);
    let lp = await this.wmsService.getPendingToReceiveLP(item.No, item.ItemNo, item.UnitofMeasureCode, item.BinCode);
    console.log('Bincode =>', item.BinCode);
    let lstUoM = await this.wmsService.getUnitOfMeasure(item.ItemNo);

    if (lp.LP_Pending_To_Receive > 0) {
      const popover = await this.popoverController.create({
        component: LicensePlatesComponent,
        cssClass: 'popLicensePlate',
        componentProps: { options: { item, lp, lstUoM } },
        backdropDismiss: false
      });
      this.intServ.loadingFunc(false);
      await popover.present();
      const { data } = await popover.onDidDismiss();
   
      if(data.data == 'creado'){
       this.getReceipt();
     }
    } else {

      this.interceptService.loadingFunc(false);
      this.interceptService.alertFunc(this.jsonService.getAlert('alert', ' ', 'You have created all the LP Pending To Receive'))
    }

  }

  private async getReceipt() {
    this.intServ.loadingFunc(true);
    let wms =   await this.storage.get('wms');
     console.log('data =>', wms);
    try {
      let receipt = await this.wmsService.getReceiptByNo(wms.id);

      if(receipt.Error) throw new Error(receipt.Error.Message);
      
      this.mappingReceipt(receipt);
      
    } catch (error) {
      this.intServ.loadingFunc(false);
      
      this.intServ.alertFunc(this.js.getAlert('error', ' ', error.message));
    }

  }
  /**
   * Mapping Receipts
   * @param receipt { WarehouseReceipt: {WarehouseReceiptHeader, WarehouseReceiptLines} }
   */
  private async mappingReceipt(receipt: any) {
    this.wareReceipts = await this.general.ReceiptHeaderAndLines(receipt.WarehouseReceipt);
    this.GetLicencesPlateInWR(this.wareReceipts);

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




  async GetLicencesPlateInWR(wareReceipts: any = {}) {

    try {

      const lps = await this.wmsService.GetLicencesPlateInWR(wareReceipts.No, false);

      if(lps.Error) throw new Error(lps.Error.Message);
      
      this.list = await this.wmsService.createListLP(lps);
      let contador = 0;
     this.cantidades = [];
      let LpS = [];
      let LpI = [];
  
      this.LpL = [];
  
      for (const i in this.list) {
  
        for (const y in this.list[i].fields) {
  
          if (this.list[i].fields[y].name === "PLULPDocumentType" && this.list[i].fields[y].value === "Single") {
  
            LpS.push(this.list[i]);
  
            console.log(LpS);
  
          }
        }
      }
  
      LpS.filter(lp => {
  
        for (const key in lp.fields) {
  
          if (lp.fields[key].value === "Item" && lp.fields[key].name === "PLUType") {
  
            LpI.push(lp);
  
          }
        }
      });
  
      wareReceipts.lines.forEach(async (el, index) => {
  
        LpI.filter(lp => {
  
          for (const key in lp.fields) {
  
            if (lp.fields[key].value === el.LineNo && lp.fields[key].name === "PLULineNo") {
  
  
              contador++;
  
              this.LpL.push(lp);
            }
          }
        });
  
        this.cantidades[index] = contador;
  
        contador = 0;
  
      });
      
      this.intServ.loadingFunc(false);
    } catch (error) {
      this.intServ.loadingFunc(false);
    }

  }



  showLPs(item: any) {
    this.intServ.loadingFunc(true);
    let list = [];
    this.LpL.filter(lp => {

      for (const key in lp.fields) {
        if (lp.fields[key].name === "PLULineNo" && item.LineNo === lp.fields[key].value) {
          list.push(lp);
        } 
      }
    });

    this.onPopoverPl('event', list);
  }


  public async newPallet() {

    this.intServ.loadingFunc(true);

    let wareReceipts = this.wareReceipts;

    this.wmsService.set(this.wareReceipts);

    let pallet = await this.wmsService.CreateLPPallet_FromWarehouseReceiptLine(this.wareReceipts);

    let palletL = await this.wmsService.getLpNo(pallet.LPPallet_DocumentNo);

    console.log(palletL);
    let palletN = await this.wmsService.ListLpH(palletL);








    if (pallet.Created) {



      let navigationExtras: NavigationExtras = {
        state: {
          pallet: palletN,
          new: false
        },
        replaceUrl: true
      };
      this.router.navigate(['page/wms/newPallet'], navigationExtras);




    } else {

      this.intServ.loadingFunc(false);

      this.intServ.alertFunc(this.js.getAlert('error', ' ', pallet.Error.Message));





    }







  }



  async listPallet() {




    this.intServ.loadingFunc(true);

    try {



      const lpsP = await this.wmsService.GetLicencesPlateInWR(this.wareReceipts.No, true);


      if(lpsP.Error) throw Error(lpsP.Error.Message);


      console.log(lpsP.length);



      console.log('license plate pallet =>', lpsP);

      let pallet = await this.wmsService.ListPallet(lpsP);


      let pallet2 = await this.wmsService.ListPallet(lpsP);




      console.log('antes =>', pallet);
      console.log('antes =>', pallet2);


      if (pallet.length > 0 || pallet != undefined) {

        for (const i in pallet) {

          for (const j in pallet2) {


            if (pallet[i] != undefined) {

              if (pallet[i].fields[0].PLUQuantity != null) {

                if (pallet[i].fields[0].PLULPDocumentNo === pallet2[j].fields[0].PLULPDocumentNo) {

                  if (j != i) {



                    let con = pallet.splice(Number(j), 1);
                    console.log(i, j);
                    console.log(con)

                  }


                }
              } else {

                pallet.splice(Number(i), 1);

              }
            }
          }
        }



        console.log('despues =>', pallet);
        console.log('despues =>', pallet2);






        for (const i in pallet) {

          for (const j in pallet2) {
            if (pallet[i].fields[0].PLULPDocumentNo === pallet2[j].fields[0].PLULPDocumentNo) {





              let line = pallet[i].fields.find(lp => lp.PLUNo === pallet2[j].fields[0].PLUNo);

              if (line === null || line === undefined) {

                pallet[i].fields.push(pallet2[j].fields[0]);



              }

            }
          }
        }


        console.log('final =>', pallet);

        let wareReceipts = this.wareReceipts;

      

        let navigationExtras: NavigationExtras = {
          state: {
            pallet,
            wareReceipts,
            new: false
          },
          replaceUrl: true
        };
        this.router.navigate(['page/wms/listPallet'], navigationExtras);

  
      }
      else {

        this.intServ.loadingFunc(false);


        this.intServ.loadingFunc(this.js.getAlert('alert', '', 'You do not have license plate created'))
      }

    } catch (error) {

      this.intServ.loadingFunc(false);

      this.intServ.alertFunc(this.jsonService.getAlert('alert', '', error.message));

    }


  }




  async onSubmit() {


    this.intServ.alertFunc(this.js.getAlert('confirm', '', 'Confirm Whse Receipt?', async () => {

      this.intServ.loadingFunc(true);

      var alert = setTimeout(async () => {

        try {

          let postWR = await this.wmsService.Post_WarehouseReceipts(this.wareReceipts.No);

          console.log(postWR);
          if (postWR.Error) throw Error(postWR.Error.Message);

          this.wmsService.setPutAway(postWR);

          console.log('postWR', postWR);

          this.intServ.loadingFunc(false);


          this.intServ.alertFunc(this.js.getAlert('continue', '', 'Continue Process Put-Away?', () => {

            this.intServ.loadingFunc(true);



            var alert = setTimeout(() => {

              this.intServ.loadingFunc(false);

              this.intServ.alertFunc(this.js.getAlert('edit', 'If you press "No" the Put-Away will be processed by default on the floor!', 'Will you edit the default Put-Away?', async () => {

                this.intServ.loadingFunc(true);



                try {

                  let dataPw = this.wmsService.getPutAway();


                  let data = await this.wmsService.Post_WarehousePutAways(dataPw.Warehouse_Activity_No);


                  console.log('postWP', data);


                  if (data.Error) throw Error(data.Error.Message);





                  this.intServ.loadingFunc(false);
                  this.intServ.alertFunc(this.js.getAlert('success', '', `The put away ${dataPw.Warehouse_Activity_No} was successfully posted with the registration number ${data.Registered_Whse_Activity}`, () => {


                    this.router.navigate(['/page/wms/wmsReceipt']);
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


          let e = error.message.split('/')


          this.intServ.alertFunc(this.js.getAlert('error', '', e[0]));
        }

        clearTimeout(alert);
      }, 100)








    }))







  }




}
