import { computeMsgId } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { JsonService } from './json.service';

@Injectable({
  providedIn: 'root'
})
export class SyncerpService {
  private session: any;

  constructor(
    private apiConnect: ApiService,
    private js: JsonService
  ) { }

  // Process Request structure
  async processRequest(processMethod, pageSize, position, salesPerson) {
    this.session = await this.js.getSession();
    return {
      customerId: this.session.login.customerId,
      environmentId: this.session.login.environment.environmentId,
      processMethod,
      userId: this.session.login.userId,
      company: this.session.login.defaultCompany,
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
  async processRequestParams(processMethod, Parameters: any) {
    this.session = await this.js.getSession();
    return {
      customerId: this.session.login.customerId,
      environmentId: this.session.login.environment.environmentId,
      processMethod: processMethod,
      userId: this.session.login.userId,
      company: this.session.login.defaultCompany,
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
          var obj = JSON.parse(rsl.value);
          value = obj;
        }
      )
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
}
