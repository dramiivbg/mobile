import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Process } from '@mdl/module';
import { EditPutAwayComponent } from '@prv/components/edit-put-away/edit-put-away.component';
import { GeneralService } from '@svc/general.service';
import { ModuleService } from '@svc/gui/module.service';
import { InterceptService } from '@svc/intercept.service';
import { JsonService } from '@svc/json.service';
import { SyncerpService } from '@svc/syncerp.service';
import { WmsService } from '@svc/wms.service';

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

  constructor(private syncerp: SyncerpService
    , private general: GeneralService
    , private intServ: InterceptService
    , private js: JsonService
    , private router: Router
    , private moduleService: ModuleService,
    private wmsService:WmsService,
    private modalCtrl: ModalController
  ) { 
    let objFunc = {
      func: () => {
        this.onBack();
      }
    };
    this.intServ.appBackFunc(objFunc);
  }

  public ngOnInit() {
  }

  public async ionViewWillEnter() {
    try {
      this.intServ.loadingFunc(true);
      this.module = await this.moduleService.getSelectedModule();
     // console.log('modules =>',this.module);
      this.session = (await this.js.getSession()).login;
    //  console.log('session =>',this.session)
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
      let p = await this.syncerp.processRequestParams(method, [{ assigned_user_id: "" }]);
      let rsl = await this.syncerp.setRequest(p);

      let wareReceipts = rsl.WarehouseReceipts;

      this.intServ.loadingFunc(false);
      await this.mappingWareReceipts(wareReceipts, process);
    }
  
    if(process.processId === 'P010'){


      this.boolean = false;

   
    
      this.intServ.loadingFunc(false);

    }


    if(process.processId === 'P011'){


      let p = await this.syncerp.processRequestParams(method, [{ assigned_user_id: "" }]);
      let rsl = await this.syncerp.setRequest(p);
      console.log(rsl);

      this.intServ.loadingFunc(false);

    }


    if(process.processId === 'P008'){

      
      let p = await this.syncerp.processRequestParams(method, [{ assigned_user_id: "" }]);
      let rsl = await this.syncerp.setRequest(p);
  
    
    await  this.mappingPutAways(rsl, process);
    }
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


  pageSplitMerge(){


    this.router.navigate(['page/wms/wmsSplitMerge']);
  }

  private async mappingPutAways(putAway:any , procesos: Process){


   let listPutAway = await this.wmsService.listsPutAways(putAway);

   console.log(listPutAway);


   if (listPutAway.length > 0 ) {

    this.intServ.loadingFunc(false);
    
     let obj = this.general.structSearch(listPutAway, `Search ${procesos.description}`, 'Put Aways', async (whsePutAwayL) => {


      let putAway = await this.wmsService.GetWarehousePutAway(whsePutAwayL.fields.No);

     let whsePutAwayH = await this.wmsService.ListPutAwayH(putAway);
   
      this.wmsService.setPutAway(putAway);


        let whsePutAway = whsePutAwayH;
        console.log(whsePutAway, putAway)
        
      this.wmsService.setPutAway(putAway);
       console.log('data =>', putAway);
       const modal = await this.modalCtrl.create({
        component: EditPutAwayComponent,
        componentProps: {whsePutAway}
    
      
      });
      modal.present();
  
      const { data, role } = await modal.onWillDismiss();
  
  
    

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

        console.log('data =>',wms);
        let navigationExtras: NavigationExtras = {
          state: {
            wms: wms,
            new: false
          },
          replaceUrl: true
        };
        this.router.navigate(['page/wms/wmsReceipt'], navigationExtras);
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
      case "P011":
        return 'Get_WarehouseInvPhysicalCount';

    }
  }

}
