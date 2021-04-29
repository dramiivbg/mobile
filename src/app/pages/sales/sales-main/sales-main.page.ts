import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { GeneralService } from 'src/app/services/general.service';
import { InterceptService } from 'src/app/services/intercept.service';
import { JsonService } from 'src/app/services/json.service';
import { SyncerpService } from 'src/app/services/syncerp.service';

@Component({
  selector: 'app-sales-main',
  templateUrl: './sales-main.page.html',
  styleUrls: ['./sales-main.page.scss'],
})
export class SalesMainPage implements OnInit {
  sessionLogin: any = {};
  session: any = {};
  modules: any = [];

  constructor(
    private syncerp: SyncerpService,
    private general: GeneralService,
    private intServ: InterceptService,
    private js: JsonService,
    private router: Router
  ) { 
  }

  async ngOnInit() {
    this.session = await this.js.getSession();
    this.sessionLogin = this.session.login;
    if (this.session.modules === null) {
      await this.js.getModules(this.session).then(rsl => this.session = rsl);
    }
    await this.createOptions();
  }

   // Create options per user
   async createOptions() {
    this.modules = this.session.modules;
  }

  async onSales(module) {
    let salesType = (module.description.toLowerCase() === 'credit memo' || module.description.toLowerCase() === 'return order') ? 'sales ' + module.description.toLowerCase() : module.description.toLowerCase();
    this.intServ.loadingFunc(true);
    let process = await this.syncerp.processRequestParams('GetSalesOrders', [{ type: salesType, pageSize:'', position:'', salesPerson: 'CA' }]);
    let sales = await this.syncerp.setRequest(process);
    let salesList = await this.general.salesOrderList(sales.SalesOrders);
    this.intServ.loadingFunc(false);
    let obj = this.general.structSearch(salesList, `Search ${salesType}`, salesType, async (sell) => {
      let navigationExtras: NavigationExtras = {
        state: {
          order: sell,
          module,
          new: false
        }
      };
      this.router.navigate(['sales/sales-form'], navigationExtras);
      setTimeout(
        () => {
          this.intServ.searchShowFunc({});
        }, 1000
      )
    }, false, 1, module);
    this.intServ.searchShowFunc(obj);
  }

}
