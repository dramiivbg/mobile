import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { cordovaInstance } from '@ionic-native/core';
import { Module, Process } from '@mdl/module';
import { GeneralService } from '@svc/general.service';
import { ModuleService } from '@svc/gui/module.service';
import { InterceptService } from '@svc/intercept.service';
import { JsonService } from '@svc/json.service';
import { OfflineService } from '@svc/offline.service';
import { SyncerpService } from '@svc/syncerp.service';
import { E_PROCESSTYPE } from '@var/enums';

@Component({
  selector: 'app-sales-page',
  templateUrl: './sales-page.page.html',
  styleUrls: ['./sales-page.page.scss'],
})
export class SalesPagePage implements OnInit {
  private salesList: Array<any> = [];
  private permissions: Array<E_PROCESSTYPE>;
  private new: boolean = false;

  module: Module;
  process: Process = {
    processId: '',
    description: '',
    permissions: [],
    salesType: '',
    sysPermits: []
  };
  sales: any = undefined;
  temporaly: any = undefined;
  session: any = {};
  tempPerc: number;

  constructor(
    private syncerp: SyncerpService,
    private general: GeneralService,
    private intServ: InterceptService,
    private router: Router,
    private route: ActivatedRoute,
    private moduleService: ModuleService,
    private js: JsonService,
    private offline: OfflineService
  ) {
    let objFunc = {
      func: () => {
        this.onBack();
      }
    };
    this.intServ.appBackFunc(objFunc);
    this.route.queryParams.subscribe(async params => {
      if (this.router.getCurrentNavigation().extras.state){
        this.salesList = this.router.getCurrentNavigation().extras.state.salesList;
        if (this.salesList.length > 0)
          this.sales = this.salesList[this.salesList.length- 1];
        else
          this.sales = undefined;
      } else {
        this.router.navigate(['sales/sales-main'], { replaceUrl: true })
      }
    });
  }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    this.intServ.loadingFunc(true);
    this.session = (await this.js.getSession()).login;
    this.module = this.moduleService.getSelectedModule();
    this.process = this.moduleService.getSelectedProcess();
    console.log(this.process);
    this.permissions = this.process.sysPermits;
    if (this.permissions.indexOf(E_PROCESSTYPE.New) !== -1)
      this.new = true;
    else 
      this.new = false;
    await this.getTemp();
    this.intServ.loadingFunc(false);
  }

  async onSalesList() {
    this.intServ.loadingFunc(true);
    let obj = this.general.structSearch(this.salesList, `Search ${this.process.salesType}`, this.process.salesType, async (sell) => {
      let navigationExtras: NavigationExtras = {
        state: {
          order: sell,
          new: false
        },
        replaceUrl: true
      };
      this.router.navigate(['sales/sales-form'], navigationExtras);
      setTimeout(
        () => {
          this.intServ.searchShowFunc({});
        }, 1000
      )
    }, false, 1, this.process);
    this.intServ.searchShowFunc(obj);
    this.intServ.loadingFunc(false);
  }

  /**
   * Create new sales order
   */
   async onAddSales() {
    if (this.new) {
      this.intServ.loadingFunc(true);
      let customers: any = await this.getCustomers();
      if (customers.length > 0) {
        let obj = this.general.structSearch(customers, 'Search customers', 'Customers', (customer) => {
          let navigationExtras: NavigationExtras = {
            state: {
              customer,
              new: true
            }
          };
          this.router.navigate(['sales/sales-form'], navigationExtras);
        });
        this.intServ.searchShowFunc(obj);
      } else {
        this.intServ.alertFunc(this.js.getAlert('alert', 'Alert', 'No customers were found.'));
      }
      this.intServ.loadingFunc(false);
    } else {
      this.intServ.alertFunc(this.js.getAlert('alert', 'Alert', 'You do not have permissions to add new sales'));
    }
  }

  async onTemp() {
    this.intServ.loadingFunc(true);
    let obj = this.general.structSearch(this.temporaly, `Search temp ${this.process.salesType}`, this.process.salesType, async (temp) => {
      let navigationExtras: NavigationExtras = {
        state: {
          temp,
          new: false
        }
      };
      this.router.navigate(['sales/sales-form'], navigationExtras);
      setTimeout(
        () => {
          this.intServ.searchShowFunc({});
        }, 1000
      )
    }, false, 1, this.process);
    this.intServ.searchShowFunc(obj);
    this.intServ.loadingFunc(false);
  }

  /**
   * Return to the modules.
   */
   onBack() {
    this.router.navigate(['sales/sales-main']);
  }

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

  async getTemp() {
    let temporaly = await this.offline.getProcess('ProcessSalesOrders');
    if (temporaly !== null) {
      this.temporaly = temporaly.filter(
        x => {
          return (x.documentType === this.process.salesType);
        }
      )
      if (this.temporaly.length > 0) {
        this.tempPerc = ((this.temporaly.length * 10) / 100);
      } else {
        this.temporaly = null;
      }
    } else {
      this.temporaly = null;
    }
  }

  async onSyncTemp() {
    try {
      this.intServ.loadingFunc(true);
      for (let i in this.temporaly) {
        this.temporaly[i].parameters['SalesOrder'] = this.temporaly[i].id;
        let sell = await this.syncerp.setRequest(await this.syncerp.processRequestParams('ProcessSalesOrders', [this.temporaly[i].parameters]));
        if (sell.temp !== undefined) {
          throw new Error("You do not have a connection available.");
        }
      }
      this.intServ.loadingFunc(false); 
      this.ionViewWillEnter();
    } catch (error) {
      this.intServ.alertFunc(this.js.getAlert('error', 'Error', error));
      this.intServ.loadingFunc(false); 
    }
  }

}
