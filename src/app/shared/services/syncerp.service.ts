import { computeMsgId } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { SK_SELECTED_COMPANY } from '@var/consts';
import { ApiService } from './api.service';
import { JsonService } from './json.service';

import { Storage } from '@ionic/storage';

@Injectable()
export class SyncerpService {
  private session: any;
  private module: any = {};
  private methods: Array<string> = [
    'GetSalesOrders', 
    'GetCustomers',
    'GetItemCategories',
    'GetSalesCount',
    'GetTaxPostings'
  ]

  constructor(
    private apiConnect: ApiService,
    private js: JsonService,
    private storage: Storage
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

  async sycnAll(module) : Promise<boolean> {
    let process: any = {};
    try {
      this.module = module;
      for (let i in this.methods) {
        switch(this.methods[i]) {
          case 'GetSalesOrders':
            this.syncSales(this.methods[i]);
            break;
          case 'GetTaxPostings':
            process = await this.processRequestParams(this.methods[i], []);
            await this.setRequest(process);
            break;
          default:
            process = await this.processRequest(this.methods[i], "0", "", this.module.erpUserId);
            await this.setRequest(process);
            break;
        }
      }
      return true;
    } catch (error) {
      return false;
    }
  }

  async syncSales(method: string) {
    let processes = this.module.processes;
    processes.forEach(async p => {
      let process = await this.processRequestParams(method, [{ type: p.description, pageSize:'', position:'', salesPerson: this.module.erpUserId }]);
      let sales = await this.setRequest(process);
    });
    // let process = await this.syncerp.processRequestParams(method, [{ type: type, pageSize:'', position:'', salesPerson: 'CA' }]);
  }

}
