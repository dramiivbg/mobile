import { HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SqlitePlureService } from './sqlite-plure.service';

@Injectable()
export class OfflineService {
  private module: any = {};
  private methods: Array<string> = [
    'GetSalesOrders', 
    'GetCustomers',
    'GetItemCategories',
    'GetSalesCount'
  ]

  constructor(
    private sqLite: SqlitePlureService
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

}
