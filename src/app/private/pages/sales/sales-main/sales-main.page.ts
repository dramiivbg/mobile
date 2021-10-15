import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
// import services
import { GeneralService } from '@svc/general.service';
import { ModuleService } from '@svc/gui/module.service';
import { InterceptService } from '@svc/intercept.service';
import { JsonService } from '@svc/json.service';
import { SyncerpService } from '@svc/syncerp.service';

// import models
import { Process } from '@mdl/module';

@Component({
  selector: 'app-sales-main',
  templateUrl: './sales-main.page.html',
  styleUrls: ['./sales-main.page.scss'],
})
export class SalesMainPage implements OnInit {
  sessionLogin: any = {};
  session: any = {};
  module: any = {};
  salesCount: any = {};

  constructor(
    private syncerp: SyncerpService,
    private general: GeneralService,
    private intServ: InterceptService,
    private js: JsonService,
    private router: Router,
    private moduleService: ModuleService
  ) { 
    let objFunc = {
      func: () => {
        this.onBack();
      }
    };
    this.intServ.appBackFunc(objFunc);
  }

  async ngOnInit() {}

  async ionViewWillEnter() {
    try {
      this.intServ.loadingFunc(true);
      this.module = this.moduleService.getSelectedModule();
      this.session = (await this.js.getSession()).login;
      await this.getSalesCount(); 
      this.intServ.loadingFunc(false);
    } catch (error) {
      this.intServ.loadingFunc(false);
    }
  }

  async onSales(process: Process) {
    this.intServ.loadingFunc(true);
    const method = await this.method(process);
    process.salesType = await this.general.typeSalesBC(process);
    process.sysPermits = await this.general.getPermissions(process.permissions);
    await this.moduleService.setSelectedProcess(process);
    let p = await this.syncerp.processRequestParams(method, [{ type: process.salesType, pageSize:'', position:'', salesPerson: this.module.erpUserId }]);
    let sales = await this.syncerp.setRequest(p);
    let salesList = await this.general.salesOrderList(sales.SalesOrders);
    let navg: NavigationExtras = {
      state: {
        salesList
      },
      replaceUrl: true
    }
    this.router.navigate(['page/sales/page'], navg);
    this.intServ.loadingFunc(false);
  }

  /**
    * Return to the modules.
    */
  onBack() {
    this.router.navigate(['page/main/modules'], { replaceUrl: true });
  }

  private async getSalesCount() {
    try {
      let salesCountStr = await this.syncerp.processRequestParams('GetSalesCount', [{ pageSize:'', salesPerson: this.module.erpUserId }]);
      let salesCount = (await this.syncerp.setProcessRequest(salesCountStr)).Sales[0];
      
      salesCount.Amount_Order = salesCount.Amount_Order === undefined ? 0 : salesCount.Amount_Order;
      salesCount.Count_Order = salesCount.Count_Order === undefined ? 0 : salesCount.Count_Order;

      salesCount.Amount_Return_Order = salesCount.Amount_Return_Order === undefined ? 0 : salesCount.Amount_Return_Order;
      salesCount.Count_Return_Order = salesCount.Count_Return_Order === undefined ? 0 : salesCount.Count_Return_Order;

      salesCount.Amount_Invoice = salesCount.Amount_Invoice === undefined ? 0 : salesCount.Amount_Invoice;
      salesCount.Count_Invoice = salesCount.Count_Invoice === undefined ? 0 : salesCount.Count_Invoice;

      salesCount.Amount_Credit_Memo = salesCount.Amount_Credit_Memo === undefined ? 0 : salesCount.Amount_Credit_Memo;
      salesCount.Count_Credit_Memo = salesCount.Count_Credit_Memo === undefined ? 0 : salesCount.Count_Credit_Memo;
      this.salesCount = salesCount; 
    } catch (error) {
      throw error;
    }
  }

  private async method(process: Process) : Promise<string> {
    switch(process.processId) {
      case "P001":
        return 'GetSalesOrders';
      case "P002":
        return 'GetSalesReturnOrders';
      case "P003":
        return 'GetSalesInvoices';
      case "P004":
        return 'GetSalesCreditMemo';
    }
  }
  

}
