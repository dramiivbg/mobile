import { HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SqlitePlureService } from './sqlite-plure.service';

@Injectable({
  providedIn: 'root'
})
export class OfflineService {

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
      switch(method) {
        case 'GetSalesOrders':
          await this.sqLite.setItem(method, JSON.stringify(event));
        default:
          Promise.resolve(null);
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
}
