import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ModalController, PopoverController } from '@ionic/angular';
import { Process } from '@mdl/module';
import { CreatePhysicalInventoryComponent } from '@prv/components/create-physical-inventory/create-physical-inventory.component';
import { EditPutAwayComponent } from '@prv/components/edit-put-away/edit-put-away.component';
import { GeneralService } from '@svc/general.service';
import { ModuleService } from '@svc/gui/module.service';
import { InterceptService } from '@svc/intercept.service';
import { JsonService } from '@svc/json.service';
import { SyncerpService } from '@svc/syncerp.service';
import { WmsService } from '@svc/wms.service';
import { Storage } from '@ionic/storage';
import{environment} from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { SqlitePlureService } from '@svc/sqlite-plure.service';

import {PopoverLocateComponent} from '@prv/components/popover-locate/popover-locate.component';


@Component({
  selector: 'app-wms-main',
  templateUrl: './wms-main.page.html',
  styleUrls: ['./wms-main.page.scss'],
})
export class WmsMainPage implements OnInit {
  public module: any = {};
  public sessionLogin: any = {};
  public session: any = {};
  public boolean: Boolean = true;

  public booleanM: Boolean = false;
  public booleanInQ:Boolean = false;

  public listsLocate:any;

  public processes:any[] = [];

  constructor(private syncerp: SyncerpService
    , private general: GeneralService
    , private intServ: InterceptService
    , private js: JsonService
    , private router: Router
    , private moduleService: ModuleService,
    private wmsService:WmsService,
    private modalCtrl: ModalController,
    public popoverController: PopoverController
    ,private http: HttpClient
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


    
  }

  public async ionViewWillEnter() {

    let session =  (await this.js.getSession()).login;
   this.http.get(environment.api+session.userId).subscribe(res => {

    this.listsLocate = res;
   });

    try {
      this.intServ.loadingFunc(true);
      this.module = await this.moduleService.getSelectedModule();

      this.module.processes.filter(mod => {

        if(mod.processId != 'P011'){
  
  
          this.processes.push(mod);
  
        }
      });

   
      this.session = (await this.js.getSession()).login;
      console.log('session =>',this.session)




      this.intServ.loadingFunc(false);
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

  public async onWMS(process: Process) {

  //  console.log('procesos =>',process)
    this.intServ.loadingFunc(true);
    const method = await this.method(process);
   console.log('procesos =>', method);
    process.salesType = await this.general.typeSalesBC(process);
   // console.log('tipos de ventas =>',process.salesType);
    process.sysPermits = await this.general.getPermissions(process.permissions);
    // console.log('tipos de permisos =>',process.sysPermits);
    await this.moduleService.setSelectedProcess(process);

   // console.log('erpUserId =>', this.module.erpUserId);

    if (process.processId === 'P007') {
     // let p = await this.syncerp.processRequestParams(method, [{ assigned_user_id: this.session.userId}]);

     let p = await this.syncerp.processRequestParams(method, [{ assigned_user_id: " "}]);
      try {

        let rsl = await this.syncerp.setRequest(p);


        if(rsl.Error) throw new Error(rsl.Error.Message);
        
   
       let wareReceipts = rsl.WarehouseReceipts;

      this.intServ.loadingFunc(false);
      await this.mappingWareReceipts(wareReceipts, process);
        
      } catch (error) {

        this.intServ.loadingFunc(false);
        this.intServ.alertFunc(this.js.getAlert('error', '', error.message));

      }
      
    }
  
    if(process.processId === 'P010'){


      this.boolean = false;

      this.booleanM = true;

   
    
      this.intServ.loadingFunc(false);

    }


    if(process.processId === 'P008'){

    //  let p = await this.syncerp.processRequestParams(method, [{ assigned_user_id: this.session.userId }]);
      let p = await this.syncerp.processRequestParams(method, [{ assigned_user_id: "" }]);
      try {
        let rsl = await this.syncerp.setRequest(p);

        if(rsl.Error) throw new Error(rsl.Error.Message);
           
      await  this.mappingPutAways(rsl, process);
        
      } catch (error) {

        this.intServ.loadingFunc(false);
        this.intServ.alertFunc(this.js.getAlert('error', '', error.message));   
      }
      

    }

  }


  menuInqueris(){


    this.boolean = false;
    this.booleanInQ = true;


  }




  pageReadLicensePlate(){



    this.router.navigate(['page/wms/readLicensePlate']);
  }


  pageReadBinContent(){


    
    this.router.navigate(['page/wms/readBinContent']);

  }


  pageBintoBin(){


    this.router.navigate(['page/wms/binToBin']);

  }

  pageMovement(){


    this.router.navigate(['page/wms/wmsMovement']);
  }

  pageReclassification(){


    this.router.navigate(['page/wms/whItemReclassification']);
  }


  pageItemJournal(){


    this.router.navigate(['page/wms/wmsItemJournal']);
  }


 async selectPI(ev){


  const popover = await this.popoverController.create({
    component: CreatePhysicalInventoryComponent,
    cssClass: 'createPhysicalInventoryComponent',
    backdropDismiss: false
  });
  await popover.present();

  const { data } = await popover.onDidDismiss();


  if(data.data != null){

    this.intServ.loadingFunc(true);
    try {

      let res = await this.wmsService.Create_WarehouseInvPhysicalCount(data.zone,"",data.locationCode,data.fecha,data.data);

      console.log(res);

      if(res.Error) throw new Error(res.Error.Message);

      if(res.error) throw new Error(res.error.message);

      if(res.message) throw new Error(res.message);
      

      let p = await this.syncerp.processRequestParams('Get_WarehouseInvPhysicalCount', [{ LocationCode: data.locationCode }]);
      let rsl = await this.syncerp.setRequest(p);
    
      await  this.mappingPhysicalI(rsl);
      
    } catch (error) {
      
    this.intServ.loadingFunc(false);
    this.intServ.alertFunc(this.js.getAlert('error', '', error.message));
    }

  
  }


  }

  pageSplitMerge(){


    this.router.navigate(['page/wms/wmsSplitMerge']);
  }

  
  private async mappingPhysicalI(listPI:any){


    let lists = await this.wmsService.listPI(listPI);
 
    console.log(lists);

    let listOr = await this.wmsService.listPI(listPI);
 
 
    if (lists.length > 0 ) {
 
     this.intServ.loadingFunc(false);


     for (const i in listOr) {
      for (const j in listOr) {
     
          if (j !== i) {
      
            if(listOr[i].fields.JournalBatchName === listOr[j].fields.JournalBatchName) listOr.splice(Number(j));
          }

        
       
      }
     }
     
      this.intServ.loadingFunc(false);
     let obj = this.general.structSearch(listOr, `Physical Inv. Journal `, 'WH Physical Inv. Journal', async (data) => {
      this.intServ.loadingFunc(true);
      let listsOr = [];

     
      for (const i in lists) {
        if (lists[i].fields.JournalBatchName === data.fields.JournalBatchName) {
          listsOr.push(lists[i]);
          
        }
      }

      console.log(listsOr);

      var alert = setTimeout(() => {

        this.intServ.loadingFunc(false);
      let obj = this.general.structSearch(listsOr, `Physical Inv Journal-Counting `, 'Scan/Type Bin Code', async (data,bin) => {

        this.wmsService.set(bin);
         var alert = setTimeout(() => {

          console.log(data);


          let obj = this.general.structSearch(data,  `Physical Inv Journal-Counting `, 'Scan/Type License Plate', async (data) => {}, false, 6);

          this.intServ.searchShowFunc(obj);
          clearTimeout(alert);
        }, 100)
  
    
    }, false, 5);

    this.intServ.searchShowFunc(obj);

    clearTimeout(alert);
  }, 100)

  }, false, 7);

  this.intServ.searchShowFunc(obj);


  
 
     
    } else {
 
     this.intServ.loadingFunc(false);
      this.intServ.alertFunc(this.js.getAlert('alert', 'Alert', `list Physical Inventory  Empty`));
    }

   }


  async popoverLocate(ev){

      
  const popover = await this.popoverController.create({
    component: PopoverLocateComponent,
    cssClass: 'popoverLocateComponent',
    event:ev,
    componentProps:{listLocale:this.listsLocate}
  });
  await popover.present();

  const { data } = await popover.onDidDismiss();

  console.log('locate =>',data);

   }

  private async mappingPutAways(putAway:any , procesos: Process){

   
   let listPutAway = await this.wmsService.listsPutAways(putAway);

   console.log(listPutAway);


   if (listPutAway.length > 0 ) {

    this.intServ.loadingFunc(false);
     let obj = this.general.structSearch(listPutAway, `Search ${procesos.description}`, 'Put Aways', async (whsePutAwayL) => {

      this.intServ.loadingFunc(true);
      let putAway = await this.wmsService.GetWarehousePutAway(whsePutAwayL.fields.No);

     let whsePutAwayH = await this.wmsService.ListPutAwayH(putAway);
   
      this.wmsService.setPutAway(putAway);


        let whsePutAway = whsePutAwayH;
        console.log(whsePutAway, putAway)
        
       this.storage.set('setPutAway',putAway);
      this.storage.set('whsePutAway', whsePutAway);

      this.router.navigate(['page/wms/wmsPutAway']);
    
      setTimeout(
         () => {
           this.intServ.searchShowFunc({});
         }, 1000
       )
     }, false, 4);
     this.intServ.searchShowFunc(obj);

    
   } else {

    this.intServ.loadingFunc(false);
     this.intServ.alertFunc(this.js.getAlert('alert', 'Alert', `No ${procesos.salesType} were found.`));
   }


   

   

  }

  private async mappingWareReceipts(wareReceipts: any, process: Process) {
    let receipts = await this.general.ReceiptsList(wareReceipts);
    if (receipts > 0 || receipts != undefined) {
      console.log(process);

      let obj = this.general.structSearch(receipts, `Search ${process.description}`, 'Receipts', async (wms) => {

       // console.log('data =>',wms);

        this.storage.set('wms', wms);

         this.router.navigate(['page/wms/wmsReceipt']);
        setTimeout(
          () => {
            this.intServ.searchShowFunc({});
          }, 1000
        )
      }, false, 0, process);
      this.intServ.searchShowFunc(obj);
    } else {
      this.intServ.alertFunc(this.js.getAlert('alert', 'Alert', `No ${process.salesType} were found.`));
    }
  }

  private async method(process: Process) : Promise<string> {
    switch(process.processId) {
      case "P007":
        return 'GetWarehouseReceipts';
      case "P008":
        return 'GetWarehousePutAways';
      

    }
  }

}
