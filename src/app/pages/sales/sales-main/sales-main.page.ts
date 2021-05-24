import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
// import services
import { GeneralService } from '@svc/general.service';
import { ModuleService } from '@svc/gui/module.service';
import { InterceptService } from '@svc/intercept.service';
import { JsonService } from '@svc/json.service';
import { SyncerpService } from '@svc/syncerp.service';
// import vars
import { E_MODULETYPE } from '@var/enums';
// import models
import { Module, Process } from '@mdl/module';

@Component({
  selector: 'app-sales-main',
  templateUrl: './sales-main.page.html',
  styleUrls: ['./sales-main.page.scss'],
})
export class SalesMainPage implements OnInit {
  sessionLogin: any = {};
  session: any = {};
  module: any = {};

  constructor(private syncerp: SyncerpService,
    private general: GeneralService,
    private intServ: InterceptService,
    private js: JsonService,
    private router: Router,
    private moduleService: ModuleService
  ) { }

  async ngOnInit() {}

  async ionViewWillEnter() {
    this.module = this.moduleService.getSelectedModule();
    await this.js.getSession().then(
      rsl => this.session = rsl.login
    );
  }

  async onSales(process: Process) {
    process.salesType = await this.general.typeSalesBC(process);
    process.sysPermits = await this.general.getPermissions(process.permissions);
    await this.moduleService.setSelectedProcess(process);

    this.intServ.loadingFunc(true);
    let p = await this.syncerp.processRequestParams('GetSalesOrders', [{ type: process.salesType, pageSize:'', position:'', salesPerson: this.module.erpUserId }]);
    let sales = await this.syncerp.setRequest(p);
    let salesList = await this.general.salesOrderList(sales.SalesOrders);
    this.intServ.loadingFunc(false);
    let obj = this.general.structSearch(salesList, `Search ${process.salesType}`, process.salesType, async (sell) => {
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
    }, false, 1, process);
    this.intServ.searchShowFunc(obj);
  }

}
