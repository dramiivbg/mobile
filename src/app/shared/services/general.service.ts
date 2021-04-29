import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  constructor() { }

  // Structure for search component
  structSearch(array: any, title: string, name: string, func: any = null, clear: boolean =  true) {
    return {
      show: true,
      data: array,
      title,
      name,
      func,
      clear
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
      obj['shipAddress'] = await this.shipAddressList(item.ShipToAddress);
      objLst.push(obj);
    });
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
      objLst.push(obj);
    }
    // lists.forEach(async item => {
    //   let obj = {};
    //   item.fields.forEach(async field => {
    //     if (field.name === 'No'){
    //       obj['id'] = field.value
    //     }
    //     if (field.name === 'Description'){
    //       obj['value'] = field.value
    //     }
    //     obj['fields'] = await this.fieldsToJson(item.fields);
    //   });
    //   obj['listPrice'] = await this.listPrice(item.ListPrices);
    //   obj['unitOfMeasures'] = await this.UnitOfMeasuresList(item.UnitOfMeasures);
    //   objLst.push(obj);
    // });
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
    // lists.forEach(async item => {
    //   let obj = {};
    //   item.fields.forEach(async field => {
    //     if (field.name === 'Code'){
    //       obj['id'] = field.value
    //     }
    //     if (field.name === 'Description'){
    //       obj['value'] = field.value
    //     }
    //     obj['fields'] = await this.fieldsToJson(item.fields);
    //   });
    //   obj['items'] = await this.item(item.Items);
    //   objLst.push(obj);
    // });
    return objLst;
  }

  // Create List prices
  async listPrice(lists: any) : Promise<any> {
    let objLst = [];
    lists.forEach(async item => {
      let obj = {};
      item.fields.forEach(async field => {
        obj['fields'] = await this.fieldsToJson(item.fields);
      });
      objLst.push(obj);
    });
    return objLst;
  }

  // Create List prices
  async UnitOfMeasuresList(lists: any) : Promise<any> {
    let objLst = [];
    lists.forEach(async item => {
      let obj = {};
      item.fields.forEach(async field => {
        if (field.name === 'Code'){
          obj['id'] = field.value
        }
        obj['fields'] = await this.fieldsToJson(item.fields);
      });
      objLst.push(obj);
    });
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
    fields.forEach(field => {
      obj[field.name] = field.value
    });
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

}
