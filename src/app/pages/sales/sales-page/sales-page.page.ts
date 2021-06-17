import { CommentStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Module, Process } from '@mdl/module';
import { GeneralService } from '@svc/general.service';
import { ModuleService } from '@svc/gui/module.service';
import { InterceptService } from '@svc/intercept.service';
import { JsonService } from '@svc/json.service';
import { SyncerpService } from '@svc/syncerp.service';

@Component({
  selector: 'app-sales-page',
  templateUrl: './sales-page.page.html',
  styleUrls: ['./sales-page.page.scss'],
})
export class SalesPagePage implements OnInit {
  private salesList: Array<any> = [];
  module: Module;
  process: Process;
  sales: any = undefined;
  temporaly: any = undefined;
  session: any = {};

  constructor(
    private syncerp: SyncerpService,
    private general: GeneralService,
    private intServ: InterceptService,
    private router: Router,
    private route: ActivatedRoute,
    private moduleService: ModuleService,
    private js: JsonService
  ) {
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
    this.session = (await this.js.getSession()).login;
    this.module = this.moduleService.getSelectedModule();
    this.process = this.moduleService.getSelectedProcess();
  }

  async onSalesList() {
    this.intServ.loadingFunc(true);
    console.log(this.process);
    let obj = this.general.structSearch(this.salesList, `Search ${this.process.salesType}`, this.process.salesType, async (sell) => {
      let navigationExtras: NavigationExtras = {
        state: {
          order: sell,
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
   * Create new sales order
   */
   async onAddSalesOrder() {
    this.intServ.loadingFunc(true);    
    let obj = this.general.structSearch(await this.getCustomers(), 'Search customers', 'Customers', (customer) => {
      let navigationExtras: NavigationExtras = {
        state: {
          customer,
          new: true
        }
      };
      this.router.navigate(['sales/sales-form'], navigationExtras);
    });
    this.intServ.searchShowFunc(obj);
    this.intServ.loadingFunc(false);
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

}
