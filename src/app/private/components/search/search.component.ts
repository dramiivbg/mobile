import { toBase64String } from '@angular/compiler/src/output/source_map';
import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Network } from '@capacitor/network';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Platform } from '@ionic/angular';
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
import { constants } from 'buffer';

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

  private session:any;

  public lps:any[] = [];
  public active: Boolean = false;
  public lpNo:any = '';
  public bin:any = '';

  public listPicture:any[] = [];

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
    private barcodeScanner: BarcodeScanner
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

        this.searchObj = obj;
        console.log('searchObj =>',this.searchObj.type);
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


  onChangeL(e, lpNo:any = '') {
  
    switch(lpNo){

      case '':
        let val = e.target.value;
      
        if (val === '') {
          this.lps = this.lists;
        } else {
          this.lps = this.lists.filter(
            x => {
              return (x.fields.PLULPDocumentNo.toLowerCase().includes(val.toLowerCase()) || x.fields.PLUNo.toLowerCase().includes(val.toLowerCase()));
            }
          )
        }
        
        break;
  
    default:
  
      this.lps = this.lists.filter(
        x => {
          return (x.fields.PLULPDocumentNo.toLowerCase().includes(lpNo.toLowerCase()));
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
          return (x.fields.JournalBatchName.toLowerCase().includes(val.toLowerCase()) || x.fields.LocationCode.toLowerCase().includes(val.toLowerCase()));
        }
      )
    }

  }


  onChangePI(e, bin:any = '') {


   switch(bin){

    case '':
      let val = e.target.value;
    
      if (val === '') {
        this.listsFilter = this.lists;
      } else {
        this.listsFilter = this.lists.filter(
          x => {
            return (x.fields.ZoneCode.toLowerCase().includes(val.toLowerCase()) || x.fields.BinCode.toLowerCase().includes(val.toLowerCase()) ||  x.fields.ItemNo.toLowerCase().includes(val.toLowerCase()));
          }
        )
      }
      
      break;

  default:

    this.listsFilter = this.lists.filter(
      x => {
        return (x.fields.BinCode.toLowerCase().includes(bin.toLowerCase()));
      }
    )

    this.active = true;

    

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


  
 public onFilter(){


    this.barcodeScanner.scan().then(
      barCodeData => {
        let code = barCodeData.text.toUpperCase();

        

        this.lpNo = code;

        this.onChangeL('', code);
      
       
      

      }
    ).catch(
      err => {
        console.log(err);
      }
    )

  }

  public onBarCode() {
    this.barcodeScanner.scan().then(
      barCodeData => {
        let code = barCodeData.text.toUpperCase();

      
        this.bin = code;

        this.onChangePI('', code);
      

      }
    ).catch(
      err => {
        console.log(err);
      }
    )
  }


  edit(e,index:any){

    let val = e.target.value;

    this.lps[index].fields.PLUQuantity = val;

  }

 async onSubmitP(listLp:any){

 

  let listI:any[] = [];

  listLp.filter(lp => {

    let line = this.listsFilter.find(inv => inv.fields.PLULicensePlates === lp.fields.PLULPDocumentNo);

    if(line !== undefined || line !== null){

      line.fields.QtyPhysInventory = lp.fields.PLUQuantity;

      listI.push(line);
    }

  });


  let lists:any[] = [];

  let  list = {
    name: "WarehouseJournalLine",
    fields: [ {
      name: "JournalTemplateName",
      value: "",
    },
    {
      name: "JournalBatchName",
      value: "",
    },
    {
      name: "LineNo",
      value: "",
    },
    {
      name: "RegisteringDate",
      value: "",
    },
    {
      name: "LocationCode",
      value: "",   
    },
    {
      name: "ItemNo",
      value: "",
    },
    {
      name: "Qty(PhysInventory)",
      value: "",
    },
    {
      name: "UserID",
      value: "",    
    },
    {
      name: "VariantCode",
      value: "",
    },
    {
      name: "SerialNo",
      value: "",      
    },
    {
      name: "LotNo",
      value: "",     
    },   
    {
      name: "PLULicensePlates",
      value: "",      
    }]
  };

  listI.filter(inv => {

    list = {
      name: "WarehouseJournalLine",
      fields: [ {
        name: "JournalTemplateName",
        value: inv.fields.JournalTemplateName,
      },
      {
        name: "JournalBatchName",
        value: inv.fields.JournalBatchName,
      },
      {
        name: "LineNo",
        value: inv.fields.LineNo,
      },
      {
        name: "RegisteringDate",
        value: inv.fields.RegisteringDate,
      },
      {
        name: "LocationCode",
        value: inv.fields.LocationCode,   
      },
      {
        name: "ItemNo",
        value: inv.fields.ItemNo,
      },
      {
        name: "Qty(PhysInventory)",
        value: Number(inv.fields.QtyPhysInventory),
      },
      {
        name: "UserID",
        value: inv.fields.UserID,    
      },
      {
        name: "VariantCode",
        value: inv.fields.VariantCode,
      },
      {
        name: "SerialNo",
        value: inv.fields.SerialNo,      
      },
      {
        name: "LotNo",
        value: inv.fields.LotNo,     
      },   
      {
        name: "PLULicensePlates",
        value: inv.fields.PLULicensePlates,      
      }]
    };

    lists.push(list);

    list = {
      name: "WarehouseJournalLine",
      fields: [ {
        name: "JournalTemplateName",
        value: "",
      },
      {
        name: "JournalBatchName",
        value: "",
      },
      {
        name: "LineNo",
        value: "",
      },
      {
        name: "RegisteringDate",
        value: "",
      },
      {
        name: "LocationCode",
        value: "",   
      },
      {
        name: "ItemNo",
        value: "",
      },
      {
        name: "Qty(PhysInventory)",
        value: "",
      },
      {
        name: "UserID",
        value: "",    
      },
      {
        name: "VariantCode",
        value: "",
      },
      {
        name: "SerialNo",
        value: "",      
      },
      {
        name: "LotNo",
        value: "",     
      },   
      {
        name: "PLULicensePlates",
        value: "",      
      }]
    };

  });

  try {

    let res = await this.wmsService.Write_WarehouseInvPhysicalCount(lists);

    if(res.Error) throw new Error(res.Error.Message);

    
    if(res.error) throw new Error(res.error.message);


  //  let resR = await this.wmsService.Register_WarehouseInvPhysicalCount(this.listsFilter[0].fields.LocationCode);

  //  if(resR.Error) throw new Error(resR.Error.Message);


    
    

    console.log(res);
    
    
  } catch (error) {


    this,this.intServ.alertFunc(this.js.getAlert('error','', error.message));
    
  }



  

  }
  
  public onBarCodeLP() {

    
    this.barcodeScanner.scan().then(
     async (barCodeData) => {
        let code = barCodeData.text.toUpperCase();

   
        this.intServ.loadingFunc(true);

        let line = this.listsFilter.find(inv => inv.fields.PLULicensePlates === code);
        
       if(line !== null || line !== undefined){

        try {
          
          let res = await this.wmsService.getLpNo(code);

          
          if(res.Error) throw new Error(res.Error.Message);

          let lp = await this.wmsService.ListLp(res);

          let lpH = await this.wmsService.ListLpH(res);

          lp.fields.PLUBinCode = lpH.fields.PLUBinCode;
          lp.fields.PLULocationCode = lpH.fields.PLULocationCode;
          lp.fields.PLUQuantity = line.fields.QtyPhysInventory;
          
          let item =  await this.wmsService.GetItem(lp.fields.PLUNo);

          let listI = await this.wmsService.listItem(item);


          listI.fields.Picture =  `data:image/jpeg;base64,${listI.fields.Picture}`;

          this.listPicture.push(listI);

          
          this.lps.push(lp);

          this.lists = this.lps;

          this.visible = true;
          this.intServ.loadingFunc(false);


          console.log(this.lps);

          console.log(this.listPicture);

          
          
        } catch (error) {

          this.intServ.loadingFunc(false);
          this.intServ.alertFunc(this.js.getAlert('error', '', error.message));
          
        }

    
       }else{

        this.intServ.loadingFunc(false);
        this.intServ.alertFunc(this.js.getAlert('error', '', `The license Plate ${code} does not exist`));
       } 
           

      }
    ).catch(
      err => {
        console.log(err);
      }
    )
  }

  
  add(index:any){

    let qty =  this.lps[index].fields.PLUQuantity;
  
      qty +=1
  
      this.lps[index].fields.PLUQuantity = qty;
    
    
  
    }
  
    res(index:any){
  
      
    let qty =  this.lps[index].fields.PLUQuantity;
  
      if(qty > 1){
   

       qty -=1
  
       this.lps[index].fields.PLUQuantity = qty;
       }
  
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
    this.lps = [];
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


    onSubmit(){


      
      this.searchObj.func(this.listsFilter);
      if (this.searchObj.clear) this.onBack();
      let appBack = {
        old: true
      }
      this.intServ.appBackFunc(appBack);

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
