import { ArrayType, ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { copyFileSync } from 'fs';
import { MenuService } from 'src/app/data/menu.service';
import { ApiService } from 'src/app/services/api.service';
import { GeneralService } from 'src/app/services/general.service';
import { InterceptService } from 'src/app/services/intercept.service';
import { JsonService } from 'src/app/services/json.service';
import { SyncerpService } from 'src/app/services/syncerp.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage implements OnInit {
  private session: any;
  private modules: [];
  private salesOrders: any;

  constructor(
    private intServ: InterceptService,
    private menuService: MenuService,
    private apiConnect: ApiService,
    private router: Router,
    private js: JsonService,
    private syncerp: SyncerpService,
    private general: GeneralService
    ) { 
      let menu = {
        menu: this.menuService.menuData(),
        showMenu: true
      }
      this.intServ.modifyMenu(menu);
    }

  async ngOnInit() {
    this.intServ.loadingFunc(true);
    this.session = await this.js.getSession();
    if (this.session.modules === null)
      this.getModules();
    else
      await this.createOptions();

    await this.syncerp.testConnection();
    let process = await this.syncerp.processRequest('GetSalesOrders', "2", "", "");
    this.salesOrders = await this.syncerp.setRequest(process);
    this.intServ.loadingFunc(false);
  }

  getModules(){
    let obj = {
      platformCode: environment.platformCode,
      environmentUserId: this.session.login.environmentUserId
    }
    this.apiConnect
      .postData('mobile', 'getmodules', obj)
      .then(
        async rsl => {
          this.js.setCache('SESSION_MODULES', rsl);
          this.session = await this.js.getSession();
          await this.createOptions();
        }
      )
      .catch(
        error => console.log(error)
      )
  }

  async createOptions() {
    this.modules = this.session.modules;
  }

  async onSalesOrder(item) {
    let list: any = await this.general.salesOrderList(this.salesOrders.SalesOrders);
    this.general.fieldsToJson(this.salesOrders.SalesOrders);
    let obj = this.general.structSearch(list, 'Search sales order', 'Sales Order');
    this.intServ.searchShowFunc(obj);
  }

  onSalesForm() {
    this.router.navigate(['sales/sales-form']);
  }

}
