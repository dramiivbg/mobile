import { HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ModuleService } from './gui/module.service';
import { SqlitePlureService } from './sqlite-plure.service';

@Injectable({
  providedIn: 'root'
})
export class OfflineService {
  private methods: Array<string> = [
    'GetSalesOrders', 
    'GetCustomers',
    'GetItemCategories',
    'GetSalesCount'
  ]

  constructor(
    private sqLite: SqlitePlureService,
    private moduleService: ModuleService
  ) { }

  /**
   * Set methods for event
   * @param method 
   * @param event 
   */
  async setProcess(method: string, event: HttpEvent<any>) : Promise<void> {
    if (method === undefined || method === null || method.length === 0) return null;
    await this.sqLite.init();
    await this.sqLite.openStorageOptions();
    let store = await this.sqLite.openStore();
    if (store) {
      if (this.methods.indexOf(method) !== -1) {
        await this.sqLite.setItem(method, JSON.stringify(event));
      }
      // switch(method) {
      //   case 'GetSalesOrders':
      //   case 'GetCustomers':
      //   case 'GetItemCategories':
      //     await this.sqLite.setItem(method, JSON.stringify(event));
      //     break;
      // }
    }
  }

  /**
   * Get method process.
   * @param method 
   * @returns 
   */
  async getProcess(method: string) : Promise<any> {
    if (method === undefined || method === null || method.length === 0) return null;
    await this.sqLite.init();
    await this.sqLite.openStorageOptions();
    let store = await this.sqLite.openStore();
    if (store) {
      let obj: any =  await this.sqLite.getItem(method);
      if (obj !== null) {
        let event: HttpEvent<any> = JSON.parse(obj);
        return event;
      }
    }
    return null;
  }

  async getAll() {
    await this.sqLite.init();
    await this.sqLite.openStorageOptions();
    let test = await this.sqLite.getAllKeysValues();
  }

  async sycnAll() : Promise<boolean> {

    await this.sqLite.init();
    await this.sqLite.openStorageOptions();
    for (let i in this.methods) {
      switch(this.methods[i]) {
        case 'GetSalesOrders':
          // let process = await this.syncerp.processRequestParams('GetSalesOrders', [{ type: salesType, pageSize:'', position:'', salesPerson: 'CA' }]);
          // let sales = await this.syncerp.setRequest(process);
          break;
        default:
          // let process = await this.syncerp.processRequest('GetCustomers', "0", "", this.module.erpUserId);
          // let customers = await this.syncerp.setRequest(process);
          break;
      }
    }
    
    return false;
  }
}
