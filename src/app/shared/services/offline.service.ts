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

  async setProcess(req: any, event: HttpEvent<any>) : Promise<void> {
    await this.sqLite.init();
    await this.sqLite.openStorageOptions();
    let store = await this.sqLite.openStore();
    if (store) {
      switch(req.processMethod) {
        case 'GetSalesOrders':
          await this.sqLite.setItem(req.processMethod, JSON.stringify(event));
        default:
          Promise.resolve(null);
      }
    }
  }

  async getProcess(req: any) : Promise<any> {
    await this.sqLite.init();
    await this.sqLite.openStorageOptions();
    let store = await this.sqLite.openStore();
    if (store) {
      let obj: any =  await this.sqLite.getItem(req.processMethod);
      if (obj !== null) {
        let event: HttpEvent<any> = JSON.parse(obj);
        return event;
      }
    }
    return null;
  }
}
