import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class JsonService {

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
