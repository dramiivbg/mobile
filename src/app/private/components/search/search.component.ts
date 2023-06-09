import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Network } from '@capacitor/network';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ModalController, Platform, PopoverController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Module, Process } from '@mdl/module';
import { AuthService } from '@svc/auth.service';

// import services
import { GeneralService } from '@svc/general.service';
import { ModuleService } from '@svc/gui/module.service';
import { InterceptService } from '@svc/intercept.service';
import { JsonService } from '@svc/json.service';
import { OfflineService } from '@svc/offline.service';
import { SalesService } from '@svc/Sales.service';
import { SyncerpService } from '@svc/syncerp.service';
import { WmsService } from '@svc/wms.service';
import { SK_OFFLINE } from '@var/consts';
import { E_PROCESSTYPE } from '@var/enums';

@Component({
  selector: 'btn-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  private module: Module;
  private process: Process;
  
  /**
   * var publics
   */
  public searchObj: any = {};
  public listsFilter: Array<any> = [];
  public lists: Array<any> = [];
  public height: Number;
  public new: boolean = false;
  private delete: boolean = false;
  private post: boolean = false;

  public visible: Boolean = false;
  public visibleI: Boolean = false;
  public items:any[] = [];
  public binCode:any;
  private session:any;

  public lps:any[] = [];
  public active: Boolean = false;
  public lpNo:any = '';
  public bin:any = '';

  public listsInv:any;

  public listPicture:any[] = [];

 public  listPictureI:any[] = [];

  constructor(private platform: Platform
    , private syncerp: SyncerpService
    , private general: GeneralService
    , private router: Router
    , private intServ: InterceptService
    , private js: JsonService
    , private moduleService: ModuleService
    , private offline: OfflineService
    , private storage: Storage
    , private salesService: SalesService,
    private wmsService: WmsService,
    private barcodeScanner: BarcodeScanner,
    private modalCtrl: ModalController,
    public popoverController: PopoverController

  ) {
    intServ.searchShow$.subscribe(
      async obj => {
        let objFunc = {
          comp: true,
          func: () => {
            this.onBack();
          }
        };
        this.intServ.appBackFunc(objFunc);

        let bin = this.wmsService.get();

        this.searchObj = obj;
        this.binCode = (this.searchObj.type === 6 && bin !== undefined) ? bin : "all";
      //  console.log('obj =>',obj);
        this.listsFilter = obj.data;

     //   console.log('listFilter =>',this.listsFilter);
        this.lists = obj.data;
        this.module = await this.moduleService.getSelectedModule();
        this.process = await this.moduleService.getSelectedProcess();
        /** start permissions for sales */
        this.onResetPermissions();
        this.getPermissions();
        this.getSession();
        // this.onHeight();
        /** end permissions for sales */
      }
    )

    
  }

 async ngOnInit() {
  
  }

 async getSession(){

    this.session = (await this.js.getSession()).login;

    console.log(this.session);
  }

  onChange(e) {
    let val = e.target.value;

  //  console.log('change =>',val);
    
    if (val === '') {
      this.listsFilter = this.lists;
    } else {
      this.listsFilter = this.lists.filter(
        x => {

          if(x.value != null){

            return (x.value.toLowerCase().includes(val.toLowerCase()) || (x.id.toLowerCase().includes(val.toLowerCase())));

          }
        
          
        }
      )
    } 
  }


  onChangeLP(e) {
    let val = e.target.value;

  //  console.log('change =>',val);
    
    if (val === '') {
      this.listsFilter = this.lists;
    } else {
      this.listsFilter = this.lists.filter(
        x => {
          return (x.fields.PLULPDocumentNo.toLowerCase().includes(val.toLowerCase()) || (String(x.id).toLowerCase().includes(val.toLowerCase())));
        }
      )
    } 
  }

  onChangeP(e) {
    let val = e.target.value;

  //  console.log('change =>',val);
    
    if (val === '') {
      this.listsFilter = this.lists;
    } else {
      this.listsFilter = this.lists.filter(
        x => {
          return (x.fields[0].PLULPDocumentNo.toLowerCase().includes(val.toLowerCase()) || (String(x.id).toLowerCase().includes(val.toLowerCase())));
        }
      )
    } 
  }

  onChangePutAway(e) {
    let val = e.target.value;

  //  console.log('change =>',val);
    
    if (val === '') {
      this.listsFilter = this.lists;
    } else {
      this.listsFilter = this.lists.filter(
        x => {
          return (x.fields.No.toLowerCase().includes(val.toLowerCase()) || (String(x.id).toLowerCase().includes(val.toLowerCase())));
        }
      )
    } 
  }

  onChangeBatch(e){

    let val = e.target.value;

    if (val === '') {
      this.listsFilter = this.lists;
    } else {
      this.listsFilter = this.lists.filter(
        x => {
          return (x.Name.toLowerCase().includes(val.toLowerCase()) || x.LocationCode.toLowerCase().includes(val.toLowerCase()));
        }
      )
    }

  }

  onChangeTemplate(e){

    
    let val = e.target.value;

    if (val === '') {
      this.listsFilter = this.lists;
    } else {
      this.listsFilter = this.lists.filter(
        x => {
          return (x.Name.toLowerCase().includes(val.toLowerCase()));
        }
      )
    }

  }


  onHeight() {
    this.platform.ready().then(
      () => {
        if (this.searchObj.type === 1) {
          let height = this.platform.height();
          height = height - 112;
          this.height = height;
        } else {
          let height = this.platform.height();
          this.height = height;
        }
      }
    )
  }






  edit(e,index:any){

    let val = e.target.value;

    this.lps[index].fields.PLUQuantity = val;

  }

  
  
  onResetPermissions() {
    this.new = false;
    this.delete = false;
  }

  /**
   * Return to the another page
   */
  onBack() {

    this.searchObj = {};
    this.listsFilter = [];
    let appBack = {
      old: true
    }
    this.intServ.appBackFunc(appBack);
   
   
  
  }

  onClick(item) {

    let data = this.wmsService.getPallet();

    if(data === undefined){



      this.searchObj.func(item);
      if (this.searchObj.clear) this.onBack();
      let appBack = {
        old: true
      }
      this.intServ.appBackFunc(appBack);
    }else{

    

      this.searchObj.func(item,data);
      if (this.searchObj.clear) this.onBack();
      let appBack = {
        old: true
      }
      this.intServ.appBackFunc(appBack);
    }

    }

  // Start Sales Orders

  /**
   * get customers
   * @returns 
   */
  async getCustomers() : Promise<any> {
    return new Promise(
      async (resolve, reject) => {
        let process = await this.syncerp.processRequest('GetCustomers', "0", "", this.module.erpUserId);
        let customers = await this.syncerp.setRequest(process);
        let customersArray = await this.general.customerList(customers.Customers);
        resolve(customersArray);
      }
    )
  }

  /**
   * Create new sales order
   */
  public async onAddSalesOrder() {
    this.intServ.loadingFunc(true);    
    let obj = this.general.structSearch(await this.getCustomers(), 'Search customers', 'Customers', (customer) => {
      let navigationExtras: NavigationExtras = {
        state: {
          customer,
          new: true
        },
        replaceUrl: true
      };
      this.router.navigate(['page/sales/form'], navigationExtras);
    });
    this.searchObj = obj;
    this.listsFilter = obj.data;
    this.lists = obj.data;
    this.intServ.loadingFunc(false);
  }

  /**
   * Delete any sales
   * @param sell sales
   * @param i 
   */
  public async onDeleteLine(sell, i) {
    let offline = await this.storage.get(SK_OFFLINE);
    if (offline && sell.parameters === undefined) {
      this.intServ.alertFunc(this.js.getAlert('alert', 'Alert', 'You do not have an available connection.'));
      return;
    } 
    if (sell.parameters !== undefined) {

     
      this.intServ.alertFunc(this.js.getAlert('confirm', 'Confirm', `Do you want to delete item No. ${sell.id}?`, 
        async () =>{
          await this.deleteSalesTemp(i);
        }
      ));
      return;
    }
    if (sell.parameters === undefined) {
      if (!this.delete) {
        this.intServ.alertFunc(this.js.getAlert('alert', 'Alert', 'You do not have permission to delete sales'));
      } else {
       // console.log('parametros =>',sell);
        this.intServ.alertFunc(this.js.getAlert('confirm', 'Confirm', `Do you want to delete item No. ${sell.id}?`, 

        
          async () =>{
            await this.deleteSales(sell, i);
          }
        ));
      }
    }
  }

  /**
   * post sales
   * @param sell 
   * @param i 
   */
  public async onPostLine(sell, i) {
    const status = await Network.getStatus();
    if (this.post) {
      if (status.connected) {
        this.intServ.alertFunc(this.js.getAlert('confirm', 'Confirm', `Do you want to Post item No. ${sell.id}?`, 
          async () =>{
            await this.postSales(sell, i);
          }
        ));
      } else {
        this.intServ.alertFunc(this.js.getAlert('alert', 'Alert', 'You do not have an available connection.'));
      }
    } else {
      this.intServ.alertFunc(this.js.getAlert('alert', 'Alert', `You do not have permission to post ${this.process.salesType.toLocaleLowerCase()}`));
    }
  }

  /**
   * Remove Sales temporaly
   * @param index 
   */
  private deleteSalesTemp(index) {
    this.offline.removeProcessSales('ProcessSalesOrders', this.listsFilter[index]);
    this.listsFilter.splice(index, 1);
  }

  /**
   * Remove BC Sales
   * @param sell { obj }
   * @param index { item line}
   */
  private async deleteSales(sell, index) {
    try {
      this.intServ.loadingFunc(true);
      let params = await this.syncerp.processRequestParams('DeleteDocument', [{ documentType: this.process.salesType, documentNo: sell.id, salesPerson: this.module.erpUserId }]);
      let dropOrder = await this.syncerp.setProcessRequest(params);
      this.intServ.loadingFunc(false);
      this.intServ.alertFunc(this.js.getAlert('success', 'Success', dropOrder.SalesOrders,
        () => {
          this.listsFilter.splice(index, 1);
          this.intServ.updateSalesFunc();
        }
      ));  
    } catch ({error}) {
      this.intServ.loadingFunc(false);
      this.intServ.alertFunc(this.js.getAlert('error', 'Error', error.message));
    }
  }
  
  /**
   * Post Sales
   * @param sell 
   * @param index 
   */
  private async postSales(sell, index) {
    try {
      this.intServ.loadingFunc(true);
      let {PostedDocNo} = await this.salesService.post(this.process.salesType, sell.id);
      console.log(PostedDocNo);
      this.intServ.alertFunc(this.js.getAlert('success', 'Success', `Post was successful. Posted Document No. ${PostedDocNo}`,
        () => {
          this.listsFilter.splice(index, 1);
          this.intServ.updateSalesFunc();
        }
      ));
      this.intServ.loadingFunc(false);
    } catch (error) {
      this.intServ.loadingFunc(false);
      this.intServ.alertFunc(this.js.getAlert('error', 'Error', error.error.message));
    }

  }

  /**
   * Permissions for actions
   */
  private async getPermissions() {
    this.new = false;
    this.delete = false;
    this.post = false;
    let process = await this.moduleService.getSelectedProcess();
    let permits: Array<E_PROCESSTYPE> = process.sysPermits;
    for (let i in permits) {
      switch (permits[i]) {
        case E_PROCESSTYPE.New:
          this.new = true;
          break;
        
        case E_PROCESSTYPE.Delete:
          this.delete = true;
          break;
        
        case E_PROCESSTYPE.Post:
          this.post = true;
          break;
      }
    }
  }

  // End Sales Orders

}
