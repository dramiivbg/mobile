import { Injectable } from '@angular/core';
import { E_MODULETYPE, E_PROCESSTYPE } from '@var/enums';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  constructor() { }

  // Structure for search component
  structSearch(array: any, title: string, name: string, func: any = null, clear: boolean =  true, type: Number = 0, process: any = {}) {
    return {
      show: true,
      data: array,
      title,
      name,
      func,
      clear,
      type,
      process
    }
  }

  // Create List sales ordeer
  async salesOrderList(lists: any) : Promise<any> {
    let objLst = [];
    for(let i in lists) {
      let obj = {};
      for(let y in lists[i].fields) {
        if (lists[i].fields[y].name === 'No'){
          obj['id'] = lists[i].fields[y].value
        }
        if (lists[i].fields[y].name === 'BilltoName'){
          obj['value'] = lists[i].fields[y].value
        }
      }
      obj['fields'] = await this.fieldsToJson(lists[i].fields);
      obj['lines'] = await this.salesOrderLinesList(lists[i].SalesLines);
      obj['genBusinessPostingGroup'] = obj['fields'].VATBusPostingGroup;
      objLst.push(obj);
    }
    return objLst;
  }

  // Create List sales ordeer
  async salesOrderLinesList(lists: any) : Promise<any> {
    let objLst = [];
    for(let i in lists) {
      let obj = {};
      for(let y in lists[i].fields) {
        if (lists[i].fields[y].name === 'No'){
          obj['id'] = lists[i].fields[y].value
        }
        if (lists[i].fields[y].name === 'Description'){
          obj['value'] = lists[i].fields[y].value
        }
      }
      obj['fields'] = await this.fieldsToJson(lists[i].fields);
      objLst.push(obj);
    }
    return objLst;
  }

  // Create List customer
  async customerList(lists: any) : Promise<any> {
    let objLst = [];
    if (lists !== undefined && lists !== null) {
      lists.forEach(async item => {
        let obj = {};
        item.fields.forEach(async field => {
          if (field.name === 'No'){
            obj['id'] = field.value
          }
          if (field.name === 'Name'){
            obj['value'] = field.value
          }
        });
        obj['fields'] = await this.fieldsToJson(item.fields);
        obj['genBusinessPostingGroup'] = obj['fields'].VATBusPostingGroup;
        obj['shipAddress'] = await this.shipAddressList(item.ShipToAddress);
        objLst.push(obj);
      });
    } else {
      objLst = [];
    }
    return objLst;
  }

  // list ship to adress
  async shipAddressList(lists: any) : Promise<any> {
    let objLst = [];
    lists.forEach(item => {
      let obj = {};
      item.fields.forEach(async field => {
        if (field.name === 'Code'){
          obj['id'] = field.value
        }
        if (field.name === 'Name'){
          obj['value'] = field.value
        }
        obj['fields'] = await this.fieldsToJson(item.fields);
      });
      objLst.push(obj);
    });
    return objLst;
  }

  // Create List customer
  async item(lists: any) : Promise<any> {
    let objLst = [];
    if (lists !== undefined && lists !== null) {
      for(let i in lists) {
        let obj = {};
        for(let y in lists[i].fields) {
          if (lists[i].fields[y].name === 'No'){
            obj['id'] = lists[i].fields[y].value
          }
          if (lists[i].fields[y].name === 'Description'){
            obj['value'] = lists[i].fields[y].value
          }
        }
        obj['fields'] = await this.fieldsToJson(lists[i].fields);
        obj['listPrice'] = await this.listPrice(lists[i].ListPrices);
        obj['unitOfMeasures'] = await this.UnitOfMeasuresList(lists[i].UnitOfMeasures);
        obj['genProdPostingGroup'] = obj['fields'].VATProdPostingGroup;
        objLst.push(obj);
      }
    } else {
      objLst = [];
    }
    return objLst;
  }

  // Create List categories
  async categories(lists: any) : Promise<any> {
    let objLst = [];
    for(let i in lists) {
      let obj = {};
      for(let y in lists[i].fields) {
        if (lists[i].fields[y].name === 'Code'){
          obj['id'] = lists[i].fields[y].value
        }
        if (lists[i].fields[y].name === 'Description'){
          obj['value'] = lists[i].fields[y].value
        }
      }
      obj['fields'] = await this.fieldsToJson(lists[i].fields);
      obj['items'] = await this.item(lists[i].Items);
      objLst.push(obj);
    }
    return objLst;
  }

  // Create List prices
  async listPrice(lists: any) : Promise<any> {
    let objLst = [];
    for (let i in lists) {
      let obj = {};
      for (let y in lists[i].fields) {
        obj['fields'] = await this.fieldsToJson(lists[i].fields);
      }
      objLst.push(obj);
    }
    return objLst;
  }

  // Create List prices
  async UnitOfMeasuresList(lists: any) : Promise<any> {
    let objLst = [];
    for (let i in lists) {
      let obj = {};
      for (let y in lists[i].fields) {
        if (lists[i].fields[y].name === 'Code'){
          obj['id'] = lists[i].fields[y].value
        }
        obj['fields'] = await this.fieldsToJson(lists[i].fields);
      }
      objLst.push(obj);
    }
    return objLst;
  }

  // generate json with erp fields.
  async listFieldsToJson(lists: any) : Promise<any> {
    let objLst = [];
    lists.forEach(async item => {
      let obj = await this.fieldsToJson(item.fields);
      objLst.push(obj);
    });
    return objLst;
  }

  async fieldsToJson(fields: any) : Promise<any> {
    let obj = {};
    for (let i in fields) {
      obj[fields[i].name] = fields[i].value
    }
    // fields.forEach(field => {
    //   obj[field.name] = field.value
    // });
    return obj;
  }

  async createFields(lists: any) : Promise<any> {
    let objLst = [];
    lists[0].fields.forEach(async field => {
      let obj = {};
      obj['id'] = field.name;
      obj['name'] = field.name;
      obj['value'] = field.value;
      obj['length'] = 50;
      obj['required'] = false;
      obj['system'] = false;
      if (field.type.toLowerCase().includes('code') || field.type.toLowerCase().includes('text')){
        obj['type'] = 'text';
      } else if (field.type.toLowerCase().includes('biginteger') || field.type.toLowerCase().includes('decimal') || field.type.toLowerCase().includes('integer')){ 
        obj['type'] = 'number';
      } else if (field.type.toLowerCase().includes('datetime')){ 
        obj['type'] = 'date';
      }
      objLst.push(obj);
    });
    return objLst;
  }

  /**
   * get permissions
   * @param p Process
   * @returns 
   */
  async getPermissions(p: any) : Promise<Array<E_PROCESSTYPE>> {
    let types: Array<E_PROCESSTYPE> = [];
    try {
      for (let i in p) {
        let id: string = p[i].permissionId;
        let allow: boolean = p[i].allow;
        if (allow) {
          let permissionEnum: E_PROCESSTYPE = await this.obtainPermissions(id);
          if (permissionEnum !== null) types.push(permissionEnum);
        }
      }
      return types;
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * Types Business Central
   * @param process 
   * @returns 
   */
  async typeSalesBC(process: any) : Promise<string> {
    switch(process.processId) {
      case 'P001':
        return 'Sales Order';
      case 'P002':
        return 'Sales Return Order';
      case 'P003':
        return 'Sales Invoice';
      case 'P004':
        return 'Sales Credit Memo';
    }
  }

  /**
   * Start Privates
   */

  private async obtainPermissions(id: string) : Promise<E_PROCESSTYPE> {
    switch(id) {
      case 'Create':
        return E_PROCESSTYPE.New;
      case 'Update':
        return E_PROCESSTYPE.Edit;
      case 'Delete':
        return E_PROCESSTYPE.Delete;
      case 'Post':
        return E_PROCESSTYPE.Post;
      default:
        return null;
    }
  }

  /**
   * End Privates
   */

}
