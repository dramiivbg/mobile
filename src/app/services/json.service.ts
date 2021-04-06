import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class JsonService {

  constructor(
    private storage: Storage
  ) { }

  // convert form to Json object
  formToJson = async (frm: FormGroup): Promise<any> => {
    return new Promise((resolve, reject) => {
      try {
        let obj: any = {};
        let strObj: string = this.returnValueControl(frm);
        obj = JSON.parse(strObj);
        resolve(obj);
      } catch (error) {
        reject(error);
      }
    });
  }

  // Return obj with sessions
  // example:
  /*
    return {
      login: {
        company: {
          companyId: string, 
          companyName: string
        },
        customerId: string,
        environmentId: string,
        environmentUserId: string,
        expirationDateToken: string,
        login: string,
        token: string,
        userId: string,
        userName: string
      },
      customerId: string,
      modules: {
        description: string,
        erpUserId: string,
        moduleId: string,
        moduleType: 0,
        userType: 1
      }
    }
  */
  async getSession() : Promise<any> {
    return {
      login: JSON.parse(await this.storage.get('SESSION_LOGIN')),
      customerId: await this.storage.get('SESSION_CUSTOMER_ID'),
      modules: await this.storage.get('SESSION_MODULES'),
    }
  }

  // Create Cache/session
  async setCache(name, value) {
    this.storage.set(name, value);
  }

  // create structure for alert message.
  getAlert( type: string, title: string, desc: string, func: any = undefined  ) : any {
    return {
      type, // (confirm|alert|success|error)
      title,
      desc,
      func
    } 
  }

  // convert form to Json object
  private returnValueControl(frmControl: any): string {
    let objStr: any = {};
    let strObj: string = '';
    for (let t in frmControl.controls) {
      if (frmControl.controls[t].value !== null && typeof frmControl.controls[t].value === 'object') {
        strObj += `"${t}":{${this.returnValueObj(frmControl.controls[t].value)}},`;
      } else {
        if (typeof frmControl.controls[t].value === 'string')
          objStr = `"${t}":"${frmControl.controls[t].value}",`;
        else
        objStr = `"${t}":${frmControl.controls[t].value},`;
        strObj += objStr;
      }
    }
    strObj = strObj.substring(0, strObj.length - 1);
    return `{${strObj}}`;
  }

  // convert form to Json object
  private returnValueObj(frmControl: any): string {
    let objStr: any = {};
    let strObj: string = '';
    for (let t in frmControl) {
      if (frmControl[t] !== null && typeof frmControl[t] === 'object') {
        strObj += `"${t}":{${this.returnValueObj(frmControl[t])}},`;
      } else {
        if (typeof frmControl[t] === 'string')
          objStr = `"${t}":"${frmControl[t]}",`
        else
        objStr = `"${t}":${frmControl[t]},`
        strObj += objStr;
      }
    }
    strObj = strObj.substring(0, strObj.length - 1);
    return `${strObj}`;
  }

}
