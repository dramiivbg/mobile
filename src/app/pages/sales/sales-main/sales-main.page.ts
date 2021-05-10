import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { GeneralService } from '@svc/general.service';
import { InterceptService } from '@svc/intercept.service';
import { JsonService } from '@svc/json.service';
import { SyncerpService } from '@svc/syncerp.service';

@Component({
  selector: 'app-sales-main',
  templateUrl: './sales-main.page.html',
  styleUrls: ['./sales-main.page.scss'],
})
export class SalesMainPage implements OnInit {
  sessionLogin: any = {};
  session: any = {};
  module: any = [];

  constructor(
    private syncerp: SyncerpService,
    private general: GeneralService,
    private intServ: InterceptService,
    private js: JsonService,
    private router: Router,
    private route: ActivatedRoute
  ) { 
    this.route.queryParams.subscribe(async params => {
      if (this.router.getCurrentNavigation().extras.state){
        this.module = this.router.getCurrentNavigation().extras.state.module;
      } else {
        this.router.navigate(['modules']);
      }
    });
  }

  async ngOnInit() {
    await this.js.getSession().then(
      rsl => this.session = rsl.login
    );
  }

  async onSales(process) {
    let salesType = '';
    switch(process.processId) {
      case 'P001':
        salesType = 'Sales Order';
        break;
      case 'P002':
        salesType = 'Sales Return Order';
        break;
      case 'P003':
        salesType = 'Sales Invoice';
        break;
      case 'P004':
        salesType = 'Sales Credit Memo';
        break;
    }
    this.intServ.loadingFunc(true);
    let p = await this.syncerp.processRequestParams('GetSalesOrders', [{ type: salesType, pageSize:'', position:'', salesPerson: 'CA' }]);
    let sales = await this.syncerp.setRequest(p);
    let salesList = await this.general.salesOrderList(sales.SalesOrders);
    this.intServ.loadingFunc(false);
    let obj = this.general.structSearch(salesList, `Search ${salesType}`, salesType, async (sell) => {
      let navigationExtras: NavigationExtras = {
        state: {
          order: sell,
          process,
          new: false,
          salesType
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
