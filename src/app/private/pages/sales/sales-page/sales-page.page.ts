import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Network } from '@capacitor/network';
import { Module, Process } from '@mdl/module';
import { GeneralService } from '@svc/general.service';
import { ModuleService } from '@svc/gui/module.service';
import { InterceptService } from '@svc/intercept.service';
import { JsonService } from '@svc/json.service';
import { OfflineService } from '@svc/offline.service';
import { SalesService } from '@svc/Sales.service';
import { SyncerpService } from '@svc/syncerp.service';
import { E_PROCESSTYPE } from '@var/enums';

@Component({
  selector: 'app-sales-page',
  templateUrl: './sales-page.page.html',
  styleUrls: ['./sales-page.page.scss'],
})
export class SalesPagePage implements OnInit {
  private salesList: any = [];
  private permissions: Array<E_PROCESSTYPE>;
  private new: boolean = false;

  public module: Module;
  public process: Process = {
    processId: '',
    description: '',
    permissions: [],
    salesType: '',
    sysPermits: []
  };
  public sales: any = undefined;
  public temporaly: any = undefined;
  public session: any = {};
  public tempPerc: number;

  constructor(private syncerp: SyncerpService
    , private general: GeneralService
    , private intServ: InterceptService
    , private router: Router
    , private route: ActivatedRoute
    , private moduleService: ModuleService
    , private js: JsonService
    , private offline: OfflineService
    , private salesService: SalesService
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
     //   console.log('lista de ventas =>',this.salesList);
        if (this.salesList.length > 0)
          this.sales = this.salesList[this.salesList.length- 1]; 
          

        else
          this.sales = undefined;
      } else {
        this.router.navigate(['page/sales/main'], { replaceUrl: true })
      }
    });
    /** update sales */
    this.intServ.updateSalesSource$.subscribe(
      async () => {
        await this.getSales();
        await this.getTemp();
      }
    )
  }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    await this.get();
  }

  public async onSalesList() {
    if (this.salesList.length > 0 ) {
      this.intServ.loadingFunc(true);
      let customers: any = await this.getCustomers();
      if (customers.length > 0) {
        let obj = this.general.structSearch(this.salesList, `Search ${this.process.salesType}`, this.process.salesType, async (sell) => {
          let navigationExtras: NavigationExtras = {
            state: {
              order: sell,
              new: false
            },
            replaceUrl: true
          };
          this.router.navigate(['page/sales/form'], navigationExtras);
          setTimeout(
            () => {
              this.intServ.searchShowFunc({});
            }, 1000
          )
        }, false, 1, this.process);
        this.intServ.searchShowFunc(obj);
      } else {
        this.intServ.alertFunc(this.js.getAlert('alert', 'Alert', 'No customers were found.'));
      }
      this.intServ.loadingFunc(false);
    } else {
      this.intServ.alertFunc(this.js.getAlert('alert', 'Alert', `There are no ${this.process.salesType.toLocaleLowerCase()} to show`))
      this.intServ.loadingFunc(false);
    }
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
          this.router.navigate(['page/sales/form'], navigationExtras);
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

  public async onTemp() {
    if (this.temporaly != null) {
      this.intServ.loadingFunc(true);
      let obj = this.general.structSearch(this.temporaly, `Search temp ${this.process.salesType}`, this.process.salesType, async (temp) => {
        let navigationExtras: NavigationExtras = {
          state: {
            temp,
            new: false
          }
        };
        this.router.navigate(['page/sales/form'], navigationExtras);
        setTimeout(
          () => {
            this.intServ.searchShowFunc({});
          }, 1000
        )
      }, false, 1, this.process);
      this.intServ.searchShowFunc(obj);
      this.intServ.loadingFunc(false);
    } else {
      this.intServ.alertFunc(this.js.getAlert('alert', 'Alert', `No temp ${this.process.salesType.toLocaleLowerCase()} to show`));
    }
  }

  /**
   * Return to the modules.
   */
   onBack() {
    this.router.navigate(['page/sales/main']);
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

  public async getTemp() {
    this.temporaly = null;
    this.tempPerc = 0;
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

  public async onSyncTemp() {
    try {
      const status = await Network.getStatus();
      if (this.temporaly != null) {
        if (!status.connected) {
          throw new Error("You do not have a connection available");
        } else {
          this.intServ.loadingFunc(true);
          for (let i in this.temporaly) {
            this.temporaly[i].parameters['SalesOrder'] = this.temporaly[i].id;
            let sell = await this.syncerp.setRequest(await this.syncerp.processRequestParams('ProcessSalesOrders', [this.temporaly[i].parameters]));
            if (sell.temp !== undefined) {
              throw new Error("Errors were encountered while trying to synchronize this sale");
            }
          }
          this.intServ.alertFunc(this.js.getAlert('success', 'Success', `Synchronized correctly`));
          this.intServ.loadingFunc(false); 
          await this.get();
          await this.getSales();
        }
      } else {
        this.intServ.alertFunc(this.js.getAlert('alert', 'Alert', `No ${this.process.salesType.toLocaleLowerCase()} to synchronize`));
      }
    } catch (error) {
      this.intServ.alertFunc(this.js.getAlert('error', 'Error', error));
      this.intServ.loadingFunc(false); 
    }
  }

  private async get() {
    this.intServ.loadingFunc(true);
    this.module = await this.moduleService.getSelectedModule();
    this.process = await this.moduleService.getSelectedProcess();
    this.permissions = this.process.sysPermits;
    if (this.permissions.indexOf(E_PROCESSTYPE.New) !== -1)
      this.new = true;
    else 
      this.new = false;
    await this.getTemp();
    this.intServ.loadingFunc(false);
  }

  private async getSales() {
    this.process = await this.moduleService.getSelectedProcess();

    console.log('process =>', this.process);
    this.salesList = await this.salesService.getSales(this.process, this.module.erpUserId);
    if (this.salesList.length > 0)
      this.sales = this.salesList[this.salesList.length- 1];
    else
      this.sales = undefined;
  }
}
