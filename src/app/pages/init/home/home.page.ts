import { ArrayType, ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
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
  private customerId: string;

  // List
  private customers: any;
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

  async ngOnInit() { }

  async ionViewWillEnter() {
    this.initOrders();
  }

  async initOrders() {
    this.intServ.loadingFunc(true);
    this.session = await this.js.getSession();
    if (this.session.modules === null)
      this.getModules();
    else
      await this.createOptions();

    await this.syncerp.testConnection();
    // let process = await this.syncerp.processRequest('GetSalesOrders', "", "", "CA");
    let process = await this.syncerp.processRequestParams('GetSalesOrders', [{ type: 'sales order', pageSize:'', position:'', salesPerson: 'CA' }]);
    let salesOrders = await this.syncerp.setRequest(process);
    this.salesOrders = await this.general.salesOrderList(salesOrders.SalesOrders);
    await this.getCustomers();
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

  // Create options per user
  async createOptions() {
    this.modules = this.session.modules;
  }

  async onSalesOrder(module) {
    let salesType = (module.description.toLowerCase() === 'credit memo' || module.description.toLowerCase() === 'return order') ? 'sales ' + module.description.toLowerCase() : module.description.toLowerCase();
    this.intServ.loadingFunc(true);
    let process = await this.syncerp.processRequestParams('GetSalesOrders', [{ type: salesType, pageSize:'', position:'', salesPerson: 'CA' }]);
    let sales = await this.syncerp.setRequest(process);
    let salesList = await this.general.salesOrderList(sales.SalesOrders);
    this.intServ.loadingFunc(false);
    let obj = this.general.structSearch(salesList, `Search ${module.description}`, module.description, async (order) => {
      let navigationExtras: NavigationExtras = {
        state: {
          order,
          module,
          new: false
        }
      };
      this.router.navigate(['sales/sales-form'], navigationExtras);
    });
    this.intServ.searchShowFunc(obj);
  }

  async onSalesForm(module) {
    this.onCustomer(module);
  }

  async getCustomers() {
    let process = await this.syncerp.processRequest('GetCustomers', "10", "", "");
    let customers = await this.syncerp.setRequest(process);
    this.customers = await this.general.customerList(customers.Customers);
  }

  // load search component
  onCustomer(module) {
    let obj = this.general.structSearch(this.customers, 'Search customers', 'Customers', (customer) => {
      let navigationExtras: NavigationExtras = {
        state: {
          customer,
          module,
          new: true
        }
      };
      this.router.navigate(['sales/sales-form'], navigationExtras);
      // this.router.navigate([`sales/sales-form/${item.id}`]);
    });
    this.intServ.searchShowFunc(obj);
  }

}
