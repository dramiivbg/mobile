import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { AlertController, ModalController, PopoverController } from '@ionic/angular';
import { Process } from '@mdl/module';
import { PopoverOptionsComponent } from '@prv/components/popover-options/popover-options.component';
import { GeneralService } from '@svc/general.service';
import { ModuleService } from '@svc/gui/module.service';
import { InterceptService } from '@svc/intercept.service';
import { JsonService } from '@svc/json.service';
import { SyncerpService } from '@svc/syncerp.service';
import { WmsService } from '@svc/wms.service';

import { LicensePlatesComponent } from '../license-plates/license-plates.component';

import {PopoverLpsComponent} from '../../../components/popover-lps/popover-lps.component';
import { ELOOP } from 'constants';
import { Key } from 'protractor';
import { SqlitePlureService } from '@svc/sqlite-plure.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { PopoverNewPalletComponent } from '@prv/components/popover-new-pallet/popover-new-pallet.component';
import { typeWithParameters } from '@angular/compiler/src/render3/util';
import { ListPalletComponent } from '@prv/components/list-pallet/list-pallet.component';

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

  private lp :any;

  private list: any = [];

  private  LpL: any = [];


private cantidades: number[] = [];

  constructor(private wmsService: WmsService
    , private intServ: InterceptService
    , private js: JsonService
    , private route: ActivatedRoute
    , private router: Router
    , private moduleService: ModuleService
    , private general: GeneralService
    , private barcodeScanner: BarcodeScanner
    , public popoverController: PopoverController
    ,private interceptService: InterceptService
    ,private jsonService: JsonService
    , private sqlitePlureService: SqlitePlureService
    , private alertController: AlertController
  ) { 
    let objFunc = {
      func: () => {
        this.onBack();
      }
    };
    this.intServ.appBackFunc(objFunc);
    this.route.queryParams.subscribe(async params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.routExtras = this.router.getCurrentNavigation().extras;

      
        this.getReceipt();
      } else {
        this.router.navigate(['page/wms/wmsMain'], { replaceUrl: true });
      }
    });
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
          this.intServ.alertFunc(this.js.getAlert('error', 'Error', `The item '${code}' does not exist on this receipt`));
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
    const popover = await this.popoverController.create({
      component: PopoverOptionsComponent,
      cssClass: 'popoverOptions',
      event: ev,
      translucent: true,
      componentProps: this.listMenu(item)
    });
    await popover.present();
  
    const { data } = await popover.onDidDismiss();
    if (data.data.No !== undefined) {
      this.onPopLicensePlates(ev, item);
    }
  }


  public async onPopoverPl(ev: any, items: any) {
    const popover = await this.popoverController.create({
      component: PopoverLpsComponent,
      cssClass: 'popoverPls',
      event: ev,
      translucent: true,
      componentProps: {lps:items}
    });
    await popover.present();
  
   
  }
  public async onPopLicensePlates(ev: any, item: any) {
    this.intServ.loadingFunc(true);

   // console.log(item);
    let lp = await this.wmsService.getPendingToReceiveLP(item.No, item.ItemNo, item.UnitofMeasureCode, item.BinCode);
    console.log('Bincode =>', item.BinCode);
    let lstUoM = await this.wmsService.getUnitOfMeasure(item.ItemNo);

    if(lp.LP_Pending_To_Receive > 0){
      const popover = await this.popoverController.create({
        component: LicensePlatesComponent,
        cssClass: 'popLicensePlate',
        event: ev,
        translucent: true,
        componentProps: { options: { item, lp, lstUoM } },
        backdropDismiss: false
      });
      this.intServ.loadingFunc(false);
      await popover.present();  
      const { data } = await popover.onDidDismiss();
      console.log(data);
 }else{

       this.interceptService.loadingFunc(false);
    this.interceptService.alertFunc(this.jsonService.getAlert('alert', 'alert','you have created all the LP Pending To Receive'))
    }
 
  }

  private async getReceipt() {
    this.intServ.loadingFunc(true);
    let wms = this.routExtras.state.wms;
   // console.log('data =>', wms);
    let receipt = await this.wmsService.getReceiptByNo(wms.id);
 
    if (receipt.Error !== undefined) {
      this.intServ.alertFunc(this.js.getAlert('error', 'Error', receipt.Error.Message));
    } else {
      this.mappingReceipt(receipt);
    }
    this.intServ.loadingFunc(false);
  }

  /**
   * Mapping Receipts
   * @param receipt { WarehouseReceipt: {WarehouseReceiptHeader, WarehouseReceiptLines} }
   */
  private async mappingReceipt(receipt: any) {
    this.wareReceipts = await this.general.ReceiptHeaderAndLines(receipt.WarehouseReceipt);


    console.log(this.wareReceipts);
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
            icon: 'close-circle-outline' ,
            obj: {}
          }
        ]
      }
    };

  }




 async GetLicencesPlateInWR(wareReceipts: any){


  
  
  const lps = await this.wmsService.GetLicencesPlateInWR(wareReceipts.No, false);


//console.log('licence plate =>', lps);



this.list = await this.wmsService.createListLP(lps);

let contador = 0;






this.cantidades = [];


let LpS = [];
let LpI = [];

this.LpL = [];





 for (const i in this.list) {

      for (const y in this.list[i].fields) {

      

    if(this.list[i].fields[y].name === "PLULPDocumentType" && this.list[i].fields[y].value === "Single"){

      LpS.push(this.list[i]);

      console.log(LpS);

      }

    

    }

 }




 LpS.filter(lp => {

  for (const key in lp.fields) {

      if(lp.fields[key].value === "Item" && lp.fields[key].name === "PLUType"){

       LpI.push(lp);
      
       }


 
  }
 });

wareReceipts.lines.forEach( async (el, index) => {
 
  LpI.filter(lp => {

  for (const key in lp.fields) {

    if(lp.fields[key].value === el.LineNo && lp.fields[key].name === "PLULineNo"){


      contador++;

      this.LpL.push(lp);


 

}


 
  }
  

 });

 this.cantidades[index] = contador;

 contador = 0;

});

//console.log('LP line =>',this.LpL);

//console.log('cantidades =>', this.cantidades);

 
 }



  showLPs(item: any){


    this.sqlitePlureService.setItem('line', item);

   let list = [];

   

   this.LpL.filter(lp =>{

      for (const key in lp.fields) {
    

        if(lp.fields[key].name === "PLULineNo" && item.LineNo === lp.fields[key].value){

          list.push(lp);

        }else{

          console.log("nooo");
        }
      }

   

    });


    

  


  this.onPopoverPl('event', list );
    

  }


  public async  newPallet(){

    this.intServ.loadingFunc(true);

    let wareReceipts = this.wareReceipts;

    this.wmsService.set(this.wareReceipts);

  let pallet = await   this.wmsService.CreateLPPallet_FromWarehouseReceiptLine(this.wareReceipts);

  let palletL = await this.wmsService.getLpNo(pallet.LPPallet_DocumentNo);

    console.log(palletL);
  let palletN = await this.wmsService.ListLpH(palletL);


   





   if(pallet.Created){



    let navigationExtras: NavigationExtras = {
      state: {
        pallet: palletN,
        new: false
      },
      replaceUrl: true
    };
    this.router.navigate(['page/wms/newPallet'], navigationExtras);

    


   }else{

    this.intServ.loadingFunc(false);

    this.intServ.alertFunc(this.js.getAlert('error', 'error', pallet.Error.Message));

   
  


   }


   

  

    
  }



  async listPallet(){


    

    this.intServ.loadingFunc(true);
    
    const lpsP = await this.wmsService.GetLicencesPlateInWR(this.wareReceipts.No, true);



  
    console.log(lpsP.length);


 
      console.log('license plate pallet =>',lpsP);
   
      let pallet = await this.wmsService.ListPallet(lpsP);
  
  
      let pallet2 = await  this.wmsService.ListPallet(lpsP);
  
     




      if(pallet.length > 0 || pallet != undefined){
          
    for (const i in pallet) {
   
      for (const j in pallet2) {

    
       if(pallet[i] != undefined){

        if(pallet[i].fields[0].PLUQuantity != null){

        if (pallet[i].fields[0].PLULPDocumentNo === pallet2[j].fields[0].PLULPDocumentNo ) {
          
          if(j != i){

          

          let con =  pallet.splice(Number(j),1);
           console.log(i,j);
         // console.log(con)

          }
       
          
        }
      }else{

        pallet.splice(Number(i),1);

      }
      }
    }
    }



    console.log(pallet);
  
   
  

    

    for (const i in pallet) {
    
      for (const j in pallet2) {
        if (pallet[i].fields[0].PLULPDocumentNo === pallet2[j].fields[0].PLULPDocumentNo) {
          
          
       


          let line = pallet[i].fields.find(lp => lp.PLUNo === pallet2[j].fields[0].PLUNo);

          if(line === null || line === undefined){

            pallet[i].fields.push( pallet2[j].fields[0]);

          
         
         }
         
        }
      }
    }


    

    


   

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
  else{

    this.intServ.loadingFunc(false);


    this.intServ.loadingFunc(this.js.getAlert('alert', '', 'You do not have license plate created'))
  }
  }


  
  
 async onSubmit(){


  this.intServ.alertFunc(this.js.getAlert('confirm', 'confirm', 'Confirm WH Receipt?',async() =>{





  let postWR =  await this.wmsService.Post_WarehouseReceipts(this.wareReceipts.No);

  this.wmsService.setPutAway(postWR);

  console.log('postWR',postWR)


  if(!postWR.Error){

    
    var alert = setTimeout(() => {
      this.intServ.alertFunc(this.js.getAlert('continue', 'continue', 'Continue Process Put-Away?', () =>{


         
          
    var alert = setTimeout(() => {
              this.intServ.alertFunc(this.js.getAlert('edit', 'By Default Put Away processed to the floor!', 'Edit Default Put-Away?', async() =>{

                this.intServ.loadingFunc(true);


                let dataPw = this.wmsService.getPutAway();


                let data = await this.wmsService.Post_WarehousePutAways(dataPw.Warehouse_Activity_No);


                console.log('postWP', data);

                if(!data.Error){


                  this.intServ.loadingFunc(false);
                  this.intServ.alertFunc(this.js.getAlert('success', '', 'The put-away was done successfully'))

                  
                }else{

                 
                  this.intServ.loadingFunc(false);
                  this.intServ.alertFunc(this.js.getAlert('error', '', data.Error.Message))


                }

            
        
             

              }));

              clearTimeout(alert);
            }, 100)
              
         

           
    

      }));
      clearTimeout(alert);
    }, 100)
  }else{



    let message = postWR.Error.Message.split('/')

    this.intServ.alertFunc(this.js.getAlert('error', '',message ))



  }

    

  }))







  }




}
