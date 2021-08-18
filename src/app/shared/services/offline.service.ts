import { HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { SK_OFFLINE } from '@var/consts';
import { SqlitePlureService } from './sqlite-plure.service';

@Injectable()
export class OfflineService {
  private module: any = {};
  private methods: Array<string> = [
    'GetCustomers',
    'GetItems',
    'GetSalesCount',
    'GetTaxPostings',
    'GetInventorySetup',
    'GetSalesOrders',
    'GetSalesInvoices',
    'GetSalesReturnOrders',
    'GetSalesCreditMemo'
  ]

  constructor(
    private sqLite: SqlitePlureService,
    private storage: Storage
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
    }
  }

  /**
   * Set methods for event
   * @param method 
   * @param event 
   */
   async setProcessSalesOrder(method: string, obj: Array<any>) : Promise<boolean> {
    if (method === undefined || method === null || method.length === 0) return null;
    await this.sqLite.init();
    await this.sqLite.openStorageOptions();
    let store = await this.sqLite.openStore();
    if (store) {
      await this.sqLite.setItem(method, JSON.stringify(obj));
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
      this.addOfflineBool(method);
      let obj: any =  await this.sqLite.getItem(method);
      // await this.sqLite.closeStore();
      if (obj !== null && obj !== '') {
        let event: HttpEvent<any> = JSON.parse(obj);
        return event;
      }
    }
    return null;
  }

  /**
   * Remove process for sales
   * @param method 
   * @param obj 
   * @returns 
   */
  async removeProcessSales(method: string, obj: any): Promise<boolean> {
    let removeBool = false;
    let list = await this.getProcess(method);
    for(let l in list) {
      if (list[l].id === obj.id && !removeBool) {
        list.splice(l, 1);
        removeBool = true;
      }
    }
    await this.setProcessSalesOrder(method, list);
    return removeBool;
  }

  async editProcessSales(method: string, obj: any): Promise<boolean> {
    let editBool = false;
    let list = await this.getProcess(method);
    for(let l in list) {
      if (list[l].id === obj.id && !editBool) {
        list[l] = obj;
        editBool = true;
      }
    }
    await this.setProcessSalesOrder(method, list);
    return editBool;
  }

  async getAll() {
    await this.sqLite.init();
    await this.sqLite.openStorageOptions();
    let test = await this.sqLite.getAllKeysValues();
  }

  async removeAll() {
    await this.sqLite.init();
    await this.sqLite.openStorageOptions();
    let keys  = await this.sqLite.getAllKeysValues();
    for (let i in keys){
      await this.sqLite.removeItem(keys[i].key);
    }
  }

  /**
   * offline true|false
   * @param method 
   */
  private async addOfflineBool(method) {
    if (this.methods.indexOf(method) !== -1) {
      this.storage.set(SK_OFFLINE, true);
    }
  }

}
