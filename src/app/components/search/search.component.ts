import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Module, Process } from '@mdl/module';

// import services
import { GeneralService } from '@svc/general.service';
import { ModuleService } from '@svc/gui/module.service';
import { InterceptService } from '@svc/intercept.service';
import { JsonService } from '@svc/json.service';
import { OfflineService } from '@svc/offline.service';
import { SyncerpService } from '@svc/syncerp.service';
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
  searchObj: any = {};
  listsFilter: Array<any> = [];
  lists: Array<any> = [];
  height: Number;
  new: boolean = false;
  delete: boolean = false;

  constructor(private platform: Platform
    , private syncerp: SyncerpService
    , private general: GeneralService
    , private router: Router
    , private intServ: InterceptService
    , private js: JsonService
    , private moduleService: ModuleService
    , private offline: OfflineService
    , private storage: Storage
  ) {
    intServ.searchShow$.subscribe(
      obj => {
        let objFunc = {
          comp: true,
          func: () => {
            this.onBack();
          }
        };
        this.intServ.appBackFunc(objFunc);

        this.searchObj = obj;
        this.listsFilter = obj.data;
        this.lists = obj.data;
        this.module = this.moduleService.getSelectedModule();
        this.process = this.moduleService.getSelectedProcess();
        /** start permissions for sales */
        this.onResetPermissions();
        this.getPermissions();
        this.onHeight();
        /** end permissions for sales */
      }
    )
  }

  ngOnInit() {}

  onChange(e) {
    let val = e.target.value;
    if (val === '') {
      this.listsFilter = this.lists;
    } else {
      this.listsFilter = this.lists.filter(
        x => {
          return (x.value.toLowerCase().includes(val.toLowerCase()) || (x.id.toLowerCase().includes(val.toLowerCase())));
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

  onResetPermissions() {
    this.new = false;
    this.delete = false;
  }

  /**
   * Return to the another page
   */
  onBack() {
    this.searchObj = {};
    let appBack = {
      old: true
    }
    this.intServ.appBackFunc(appBack);
  }

  onClick(item) {
    this.searchObj.func(item);
    if (this.searchObj.clear) this.onBack();
    let appBack = {
      old: true
    }
    this.intServ.appBackFunc(appBack);
  }

  getPermissions() {
    let process = this.moduleService.getSelectedProcess();
    let permits: Array<E_PROCESSTYPE> = process.sysPermits;
    for (let i in permits) {
      switch (permits[i]) {
        case E_PROCESSTYPE.New:
          this.new = true;
          break;
        
        case E_PROCESSTYPE.Delete:
          this.delete = true;
          break;
      }
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
  async onAddSalesOrder() {
    this.intServ.loadingFunc(true);    
    let obj = this.general.structSearch(await this.getCustomers(), 'Search customers', 'Customers', (customer) => {
      let navigationExtras: NavigationExtras = {
        state: {
          customer,
          new: true
        },
        replaceUrl: true
      };
      this.router.navigate(['sales/sales-form'], navigationExtras);
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
  async onDeleteLine(sell, i) {
    let offline = await this.storage.get(SK_OFFLINE);
    
    if (offline && sell.parameters === undefined) {
      this.intServ.alertFunc(this.js.getAlert('alert', 'Alert', 'You do not have an available connection.'));
      return;
    } 

    if (sell.parameters !== undefined) {
      this.intServ.alertFunc(this.js.getAlert('confirm', 'Confirm', `Do you want to delete item No. ${sell.id}?`, 
        async () =>{
          this.offline.removeProcessSales('ProcessSalesOrders', this.listsFilter[i]);
          this.listsFilter.splice(i, 1);
        }
      ));
      return;
    }

    if (sell.parameters === undefined) {
      if (!this.delete) {
        this.intServ.alertFunc(this.js.getAlert('alert', 'Alert', 'You do not have permission to delete sales'));
      } else {
        this.intServ.alertFunc(this.js.getAlert('confirm', 'Confirm', `Do you want to delete item No. ${sell.id}?`, 
          async () =>{
            this.intServ.loadingFunc(true);
            let params = await this.syncerp.processRequestParams('DeleteDocument', [{ documentType: this.process.salesType, documentNo: sell.id, salesPerson: this.module.erpUserId }]);
            let dropOrder = await this.syncerp.setRequest(params);
            this.intServ.loadingFunc(false);
            this.intServ.alertFunc(this.js.getAlert('success', 'Success', dropOrder.SalesOrders,
              () => {
                this.listsFilter.splice(i, 1);
              }
            )); 
          }
        ));
      }
    }
  }

  // End Sales Orders

}
