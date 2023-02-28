import { computeMsgId } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { SK_SELECTED_COMPANY } from '@var/consts';
import { ApiService } from './api.service';
import { JsonService } from './json.service';

import { Storage } from '@ionic/storage';
import { NotifyService } from './notify.service';
import { E_NOTIFYTYPE, E_PROCESSTYPE } from '@var/enums';

@Injectable()
export class SyncerpService {
  private countTask: number = 0;
  private session: any;
  private module: any = {};
  private methods: Array<string> = [
    // 'GetSalesOrders', 
    'GetCustomers',
    'GetSalesCount',
    'GetTaxPostings',
    'GetInventorySetup',
    'GetItems',
    'GetLocations'
  ];
  private notifyObj: any = {};

  constructor(private apiConnect: ApiService
    , private js: JsonService
    , private storage: Storage
    , private notify: NotifyService
  ) { }

  // Process Request structure
  async processRequest(processMethod, pageSize, position, salesPerson): Promise<any> {
    this.session = await this.js.getSession();
    let defaultCompany = JSON.parse(await this.storage.get(SK_SELECTED_COMPANY));
    return {
      customerId: this.session.login.customerId,
      environmentId: this.session.login.environment.environmentId,
      processMethod,
      userId: this.session.login.userId,
      company: defaultCompany,
      jsonRequest: JSON.stringify({
        ProcessMethod: processMethod,
        Parameters:[
          {
            pageSize,
            position,
            salesPerson
          }
        ]
      })
    }
  }

  // Process Request structure
  async processRequestParams(processMethod, Parameters: any): Promise<any> {
    this.session = await this.js.getSession();
    let defaultCompany = JSON.parse(await this.storage.get(SK_SELECTED_COMPANY));
    return {
      customerId: this.session.login.customerId,
      environmentId: this.session.login.environment.environmentId,
      processMethod: processMethod,
      userId: this.session.login.userId,
      company: defaultCompany,
      jsonRequest: JSON.stringify({
        ProcessMethod: processMethod,
        Parameters
      })
    }
  }

  // Set Request
  async setRequest(obj: any) : Promise<any> {
    var value: any;
    await this.apiConnect
      .postData('erp', 'processrequest', obj)
      .then(
        rsl => {
          let obj: any = {};
          if (rsl.temp !== undefined) {
            obj = rsl;

          } else {
            console.log(rsl);
            obj = JSON.parse(rsl.value);
          }
          value = obj;
        }
      )
      .catch((error) => {
        value = error;
      })
      return value;
  }

  public async setProcessRequest(obj: any) : Promise<any> {
    let newObj: any = {};
    try {
      let rsl: any = await this.apiConnect.postData('erp', 'processrequest', obj);
      if (rsl.temp !== undefined) {
        newObj = rsl;
      } else {
        newObj = JSON.parse(rsl.value);
      }
    } catch (error) {
      throw error;
    }
    return newObj;
  }

  // Test connection to the erp
  async testConnection() : Promise<boolean> {
    var value: boolean = false;
    this.session = await this.js.getSession();

    await this.apiConnect
      .postData('erp', `testconnection/${this.session.login.environmentId}`, {})                    
      .then(
        rsl => {
          value = rsl.isConnect;
        }
      )
      .catch(
        error => console.log(error)
      )
    return value;
  }

  async sycnAll(module, objAlert: any) : Promise<boolean> {
    
    this.countTask = 0;
    let process: any = {};
    this.notifyObj = await this.notify.createNotification(E_NOTIFYTYPE.Notify, 'We are synchronizing the sales tables', true);
    objAlert.func();
    this.notifyObj.message = 'The sales tables have been synchronized correctly.';
    try {
      this.module = module;
      for (let i in this.methods) {
        
        switch(this.methods[i]) {
          case 'GetTaxPostings':
            process = await this.processRequestParams(this.methods[i], []);
            this.setRequest(process).then(() => this.countTask++);
            break;
          case 'GetLocations':
            process = await this.processRequestParams(this.methods[i], []);
            this.setRequest(process).then(() => this.countTask++);
            break;
          case 'GetInventorySetup':
            process = await this.processRequestParams(this.methods[i], []);
            this.setRequest(process).then(() => this.countTask++);
            break;
          case 'GetCustomers':
            this.getCustomers(i);
            break;
          case 'GetItems':
            this.getItems(i);
            break;
          case 'Payments':
            break;
          default:
            console.log(this.methods[i]);
            process = await this.processRequest(this.methods[i], "0", "", this.module.erpUserId);
            this.setRequest(process).then(() => this.countTask++);
            break;
        }
      }
      if (this.module.lookupMethod !== 'GetWarehouseEmployee') {
        this.syncSales2();
      } else {
        this.getWareHouse();
      }
      this.notifyObj.loading = false;
      this.CountTaskF(objAlert);
      return true;
    } catch (error) {
      return false;
    }
  }

  async syncSales(method: string): Promise<void> {
    let processes = this.module.processes;
    processes.forEach(async p => {
      let process = await this.processRequestParams(method, [{ type: p.description, pageSize:'', position:'', salesPerson: this.module.erpUserId }]);
      this.setRequest(process);
    });
    // let process = await this.syncerp.processRequestParams(method, [{ type: type, pageSize:'', position:'', salesPerson: 'CA' }]);
  }

  private async syncSales2(): Promise<void> {
    let processes = this.module.processes;
    processes.forEach(async p => {
      const method = await this.method(p);
      if (method != '') {
        let process = await this.processRequestParams(method, [{ type: p.description, pageSize:'', position:'', salesPerson: this.module.erpUserId }]);
        this.setRequest(process);
      }
    });
    // let process = await this.syncerp.processRequestParams(method, [{ type: type, pageSize:'', position:'', salesPerson: 'CA' }]);
  }

  private async getWareHouse() {
    let processes = this.module.processes;
    processes.forEach(async p => {
      const method = await this.method(p);
      if (method != '') {
        let process = await this.processRequestParams(method, [{ assigned_user_id: this.module.erpUserId }]);
        this.setRequest(process);
      }
    });
  }

  private CountTaskF(objAlert: any) {
    setTimeout(() => {
      if (this.countTask === (this.methods.length)) {
        if (this.notifyObj.type === E_NOTIFYTYPE.Alert) {
          objAlert.funcError(this.notifyObj.message);
        }
        objAlert.func();
        this.notify.editNotification(this.notifyObj);
      } else {
        this.CountTaskF(objAlert);
      }
    }, 1000);
  }

  /**
   * Process Get Request customers
   * @param i 
   */
  private async getCustomers(i) {
    let process = await this.processRequest(this.methods[i], "0", "", this.module.erpUserId);
    this.setRequest(process).then(
      rsl => {
        if (rsl.status !== 200 && rsl.status !== undefined) {
          this.notifyObj.message = rsl.error.message;
          this.notifyObj.type = E_NOTIFYTYPE.Alert;
        } else {
          if (rsl.length < 1){
            this.notifyObj.message = 'Customers not found';
            this.notifyObj.type = E_NOTIFYTYPE.Alert;
          }
        }
        this.countTask++;
      }
    ) 
  }

  /**
   * Process Get Request customers
   * @param i 
   */
   private async getItems(i) {
    let process = await this.processRequest(this.methods[i], "0", "", this.module.erpUserId);
    this.setRequest(process).then(
      rsl => {
        if (rsl.status !== 200 && rsl.status !== undefined) {
          this.notifyObj.message = rsl.error.message;
          this.notifyObj.type = E_NOTIFYTYPE.Alert;
        } else {
          if (rsl.length < 1){
            this.notifyObj.message = 'Items not found';
            this.notifyObj.type = E_NOTIFYTYPE.Alert;
          }
        }
        this.countTask++;
      }
    ).catch(
      error => {
        console.log(error);
      }
    )
  }

  private async method(process: any) : Promise<string> {
    switch(process.processId) {
      case "P001":
        return 'GetSalesOrders';
      case "P002":
        return 'GetSalesReturnOrders';
      case "P003":
        return 'GetSalesInvoices';
      case "P004":
        return 'GetSalesCreditMemo';
      case "P007":
        return 'GetWarehouseReceipts';
      case "P008":
        return 'GetWarehousePutAways';
      case "P009":
        return ''; // Shipment
      case "P010":
        return ''; // Movement
      case "P011":
        return ''; // Physical Inventory
    }
  }

}
