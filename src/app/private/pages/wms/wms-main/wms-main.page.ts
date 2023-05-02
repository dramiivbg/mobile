import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ModalController, PopoverController } from '@ionic/angular';
import { Process } from '@mdl/module';
import { GeneralService } from '@svc/general.service';
import { ModuleService } from '@svc/gui/module.service';
import { InterceptService } from '@svc/intercept.service';
import { JsonService } from '@svc/json.service';
import { SyncerpService } from '@svc/syncerp.service';
import { WmsService } from '@svc/wms.service';
import { Storage } from '@ionic/storage';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { PopoverLocateComponent } from '@prv/components/popover-locate/popover-locate.component';
import { PopoverSettingComponent } from '@prv/components/popover-setting/popover-setting.component';



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
  public booleanInQ: Boolean = false;

  public configured = false;

  public locale: any = '';
  public listsLocate: any;

  public processes: any[] = [];

  constructor(private syncerp: SyncerpService
    , private general: GeneralService
    , private intServ: InterceptService
    , private js: JsonService
    , private router: Router
    , private moduleService: ModuleService,
    private wmsService: WmsService,
    private modalCtrl: ModalController,
    public popoverController: PopoverController
    , private http: HttpClient
    , private storage: Storage,

  ) {
    let objFunc = {
      func: () => {
        this.onBack();
      }
    };
    this.intServ.appBackFunc(objFunc);
  }

  public async ngOnInit() {

    let session = (await this.js.getSession()).login;
    this.http.get(environment.api + session.userId).subscribe(res => {

      this.listsLocate = res;
    });

    this.locale = (await this.storage.get('locale') != undefined && await this.storage.get('locale') != null) ? await this.storage.get('locale') : this.locale;

    console.log(this.locale);

    this.configured = (await this.storage.get(`configured ${session.userId}`) != undefined && 
                  await this.storage.get(`configured ${session.userId}`) != null)? await this.storage.get(`configured ${session.userId}`): false;

  }

  public async ionViewWillEnter() {

      this.intServ.loadingFunc(true);
      this.module = await this.moduleService.getSelectedModule();

      this.module.processes.filter(mod => {

        if (mod.processId != 'P011') {


          this.processes.push(mod);

        }
      });

  
      console.log('session =>', this.session)

      this.intServ.loadingFunc(false);
    
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

      let p = await this.syncerp.processRequestParams(method, [{ assigned_user_id: " " }]);
      try {

        let rsl = await this.syncerp.setRequest(p);


        if (rsl.Error) throw new Error(rsl.Error.Message);
         if(rsl.error) throw new Error(rsl.error.message);
         if(rsl.message) throw new Error(rsl.message);
         
        let wareReceipts = rsl.WarehouseReceipts;

        this.intServ.loadingFunc(false);
        await this.mappingWareReceipts(wareReceipts, process);

      } catch (error) {

        this.intServ.loadingFunc(false);
        this.intServ.alertFunc(this.js.getAlert('error', '', error.message, () => {this.router.navigate(['page/wms/wmsMain'])}));

      }

    }

    if (process.processId === 'P010') {


      this.boolean = false;

      this.booleanM = true;



      this.intServ.loadingFunc(false);

    }


    if (process.processId === 'P008') {

      //  let p = await this.syncerp.processRequestParams(method, [{ assigned_user_id: this.session.userId }]);
      let p = await this.syncerp.processRequestParams(method, [{ assigned_user_id: "" }]);
      try {
        let rsl = await this.syncerp.setRequest(p);

        if (rsl.Error) throw new Error(rsl.Error.Message);

        await this.mappingPutAways(rsl, process);

      } catch (error) {

        this.intServ.loadingFunc(false);
        this.intServ.alertFunc(this.js.getAlert('error', '', error.message));
      }


    }

  }


  ChangeLocate(){

    this.storage.set('locale',this.locale);

  }


  pagueInqueris() {


    this.router.navigate(['page/wms/Inquiries']);


  }


  pageBintoBin() {


    this.router.navigate(['page/wms/binToBin']);

  }

  pageMovement() {


    this.router.navigate(['page/wms/wmsMovement']);
  }

  pageReclassification() {


    this.router.navigate(['page/wms/whItemReclassification']);
  }


  pageItemJournal() {


    this.router.navigate(['page/wms/wmsItemJournal']);
  }


async selectTemplate() {

  let templates:any;
  let batchs:any;

  this.intServ.loadingFunc(true);
  try {
    
    let res1 = await this.wmsService.Get_WarehouseJournalTemplate(1);

    if(res1.Error) throw new Error(res1.Error.Message);

    if(res1.error) throw new Error(res1.error.message);

    if(res1.message) throw new Error(res1.message);
    
   templates = await this.wmsService.listTraking(res1.WarehouseJournalTemplate);

    
    
  } catch (error) {

    this.intServ.loadingFunc(false);
    this.intServ.alertFunc(this.js.getAlert('error','', error.message));
    return;
    
  }

    console.log(templates);
    this.intServ.loadingFunc(false);
let obj = this.general.structSearch(templates, `Physical Inv Journal-Counting `, 'Journal Template', async (data) => {

  this.storage.set('template', data.Name);
  this.intServ.loadingFunc(true);
        let erpUserId = await this.storage.get('erpUserId');

    try{

          let res2 = await this.wmsService.Get_WarehouseJournalBatch(data.Name,erpUserId);

          if(res2.Error) throw new Error(res2.Error.Message);

          if(res2.error) throw new Error(res2.error.message);

          if(res2.message) throw new Error(res2.message);
      

          batchs = await this.wmsService.listTraking(res2.WarehouseJournalBatch);

          
    
  } catch (error) {

    this.intServ.loadingFunc(false);
    this.intServ.alertFunc(this.js.getAlert('error','', error.message));
    return;
    
  }

          
          this.mappingPhysicalI(batchs,data.Name);

        
        
    }, false, 9);

    this.intServ.searchShowFunc(obj);

  }



  pageSplitMerge() {


    this.router.navigate(['page/wms/wmsSplitMerge']);
  }


  private async mappingPhysicalI(listPI: any,template:any) {

     let items:any;

      this.intServ.loadingFunc(false);
      let obj = this.general.structSearch(listPI,`Physical Inv. Journal `, 'WH Physical Inv. Journal', async (data) => {
        this.intServ.loadingFunc(true);
      try {
        
        let res3 = await this.wmsService.Get_WarehouseInvPhysicalCount(data.LocationCode,template,data.Name);

        if(res3.Error) throw new Error(res3.Error.Message);
        if(res3.error) throw new Error(res3.error.message);
        if(res3.message) throw new Error(res3.message);
        
             
       items = await this.wmsService.listTraking(res3.Warehouse_Physical_Inventory_Journal);

      this.storage.set('batch',data.Name); 
      this.storage.set('location',data.LocationCode);

       this.storage.set('inventory',items);

       
        this.router.navigate(['page/wms/physicalInventory']);
      
        setTimeout(
          () => {
            this.intServ.searchShowFunc({});
          }, 1000
        )


      } catch (error) {

        this.intServ.loadingFunc(false);
        this.intServ.alertFunc(this.js.getAlert('error','',error.message));
        return;
      }     
       
      }, false, 7);

      this.intServ.searchShowFunc(obj);

    } 


  async NewSettingPrint(){
    
    const popover = await this.popoverController.create({
      component: PopoverSettingComponent,
      cssClass: 'popoverSettingComponent',
      backdropDismiss: false,
      componentProps: { listLocale: this.listsLocate }
    });
    await popover.present();

    const { data } = await popover.onDidDismiss();

    }


  async popoverLocate(ev) {


    const popover = await this.popoverController.create({
      component: PopoverLocateComponent,
      cssClass: 'popoverLocateComponent',
      componentProps: { listLocale: this.listsLocate }
    });
    await popover.present();

    const { data } = await popover.onDidDismiss();

    if (data != undefined || data != null) {

      this.storage.set('locale', data.locationCode);

      this.locale = await this.storage.get('locale');
    }
  }

  private async mappingPutAways(putAway: any, procesos: Process) {


    let listPutAway = await this.wmsService.listsPutAways(putAway);

    console.log(listPutAway);


    if (listPutAway.length > 0) {

      this.intServ.loadingFunc(false);
      let obj = this.general.structSearch(listPutAway, `Search ${procesos.description}`, 'Put Aways', async (whsePutAwayL) => {

        this.intServ.loadingFunc(true);
        let putAway = await this.wmsService.GetWarehousePutAway(whsePutAwayL.fields.No);

        let whsePutAwayH = await this.wmsService.ListPutAwayH(putAway);

        this.wmsService.setPutAway(putAway);


        let whsePutAway = whsePutAwayH;
        console.log(whsePutAway, putAway)

        this.storage.remove('whsePutAway');

        this.storage.remove('setPutAway');

        this.storage.set('setPutAway', putAway);
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

  private async method(process: Process): Promise<string> {
    switch (process.processId) {
      case "P007":
        return 'GetWarehouseReceipts';
      case "P008":
        return 'GetWarehousePutAways';


    }
  }

}
