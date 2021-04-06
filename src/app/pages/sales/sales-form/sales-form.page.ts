import { CommentStmt, compileNgModule, ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ChildrenOutletContexts } from '@angular/router';
import { constants } from 'buffer';
import { timingSafeEqual } from 'crypto';
import { BrowserStack, Local } from 'protractor/built/driverProviders';
import { ApiService } from 'src/app/services/api.service';
import { GeneralService } from 'src/app/services/general.service';
import { InterceptService } from 'src/app/services/intercept.service';
import { JsonService } from 'src/app/services/json.service';
import { SyncerpService } from 'src/app/services/syncerp.service';

@Component({
  selector: 'app-sales-form',
  templateUrl: './sales-form.page.html',
  styleUrls: ['./sales-form.page.scss']
})
export class SalesFormPage implements OnInit {
  private customers: any;
  private customer: any = {};
  private shipAddress: any;
  private items: any = {};
  private categories: any;

  frm = new FormGroup({});
  orderDate: string = new Date().toDateString();
  deliveryDate: string = new Date().toDateString();
  fields: Array<any> = [];
  linesS: Array<any> = [];

  constructor(
    private apiConnect: ApiService,
    private formBuilder: FormBuilder,
    private intServ: InterceptService,
    private syncerp: SyncerpService,
    private general: GeneralService,
    private js: JsonService
  ) { 
    this.frm.addControl('shippingName', new FormControl("",Validators.required));
    this.frm.addControl('shippingNo', new FormControl("",Validators.required));
    this.frm.addControl('customerNo', new FormControl("",Validators.required));
    this.frm.addControl('customerName', new FormControl(""));
    // this.frm.addControl('lines', this.formBuilder.array([this.initLines()]));
    this.frm.addControl('lines', this.formBuilder.array([]));
    this.getMethods();
  }

  async ngOnInit() {
    this.intServ.loadingFunc(true);
    await this.getCustomers();
    // await this.getItems();
    await this.getCategories();
    this.intServ.loadingFunc(false);
  }

  initLines() {
    return this.formBuilder.group({
      title: [''],
      quantity: 1,
      unitPrice: 0.00,
      total: 0.00
    });
  }

  // load search component
  onCustomer() {
    let obj = this.general.structSearch(this.customers, 'Search customers', 'Customers', (item) => {
      if (item.shipAddress.length >0) {
        this.customer = item;
        this.setCustomer();
      } else {
        this.onClear();
        this.intServ.alertFunc(this.js.getAlert('alert', 'Alert', 'this customer don\'t have ship-to Address.'));
      }
    });
    this.intServ.searchShowFunc(obj);
  }

  onShipAddress() {
    let obj = this.general.structSearch(this.customer.shipAddress, 'Search ship-to address', 'ship-to address', (item) => {
      this.shipAddress = item;
      this.setShipAdress();
    });
    this.intServ.searchShowFunc(obj);
  }

  onClear() {
    this.frm.reset();
    this.customer = {};
    this.shipAddress = {};
  }

  // on click - search items
  onItem() {
    if (this.customer.id === undefined || this.shipAddress.id === undefined) {
      this.intServ.alertFunc(this.js.getAlert('alert', 'Alert', 'Please, select any customer and ship-to address'));
    } else {
      let obj = this.general.structSearch(this.categories, 'Search category', 'Categories', async (category) => {
        await this.itemsPerCategory(category);
      }, false);
      this.intServ.searchShowFunc(obj);
    }
  }

  onDeleteLine(item) {
    console.log(item);
  }

  onIncDec(i, dec) {
    let lines = this.frm.controls.lines.value;
    if (dec === 0 && lines[i].quantity !== 1) {
      lines[i].quantity -= 1;
    } else if (dec === 1) {
      lines[i].quantity += 1;
    }
    lines[i].total = Number(lines[i].quantity * lines[i].unitPrice).toFixed(2);
    this.frm.controls.lines.setValue(lines);
  }

  // get fields
  onGetFields() {
    this.apiConnect.getData('mobile', 'getfields').then(
      rsl => {
        this.fields = rsl;
        this.fields.forEach(
          x => {
            if (x.required) {
              this.frm.addControl(x.id,new FormControl("",Validators.required));
            } else {
              this.frm.addControl(x.id,new FormControl(""));
            }
          }
        );
      }
    );
  }

  async itemsPerCategory(category) {
    this.items = category.items;
    let obj = this.general.structSearch(this.items, 'Search item', 'Items', (item) => {
      var now = new Date();
      item['unitPrice'] = 0.00;
      item['total'] = 0.00;
      item.listPrice.forEach(x => {
        let sDate = (x.fields.StartingDate !== null) ? x.fields.StartingDate.split('-') : null;
        let eDate = (x.fields.EndingDate !== null) ?x.fields.EndingDate.split('-') : null;

        let startDate = (sDate !== null) ? new Date(sDate[0] + '/' + sDate[1] + '/' + sDate[2] + ' 00:00:00') : null;
        let endDate = (eDate !== null) ? new Date(eDate[0] + '/' + eDate[1] + '/' + eDate[2] + ' 23:59:59') : null;

        if ((now >= startDate || startDate === null) && (now <= endDate || endDate === null) && item['unitPrice'] === 0) {
          item['unitPrice'] = Number(x.fields.UnitPrice).toFixed(2);
          item['total'] = item['unitPrice'];
        }
      });
      
      item['quantity'] = 1;
      this.linesS.push(item);
      this.frm.controls.lines = this.setLines(item);
      this.intServ.searchShowFunc({});
    }, false);
    this.intServ.searchShowFunc(obj);
  }

  setLines(item) {
    let arr = new FormArray([]);
    if (this.frm.controls.lines.value.length > 0) {
      this.frm.controls.lines.value.forEach(
        line =>{
          arr.push(this.formBuilder.group(line));
        }
      )
    } 
    arr.push(
      this.formBuilder.group({
        title: item.value,
        id: item.id,
        categoryNo: item.id,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.total
      })
    );
    return arr;  
  }

  setLines2(item) {
    return {
      title: item.value,
      id: item.id,
      categoryNo: item.id,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      total: item.total
    };      
  }


  async getCustomers() {
    let process = await this.syncerp.processRequest('GetCustomers', "10", "", "");
    let customers = await this.syncerp.setRequest(process);
    this.customers = await this.general.customerList(customers.Customers);
    // this.fields = await this.general.createFields(customers.Customers);
    // await this.getFields();
  }

  // Disabled
  // Get items
  async getItems() {
    let process = await this.syncerp.processRequestParams('GetTableDataSet', [{ tableNo: 27, pageSize: '', position: '' }]);
    let items = await this.syncerp.setRequest(process);
    this.items = await this.general.item(items.records);
  }

  async getCategories() {
    let process = await this.syncerp.processRequest('GetItemCategories', "10", "", "");
    let categories = await this.syncerp.setRequest(process);
    this.categories = await this.general.categories(categories.Categories);
  }

  setCustomer() {
    this.frm.controls['customerNo'].setValue(this.customer.id);
    this.frm.controls['customerName'].setValue(this.customer.value);
  }

  setShipAdress() {
    this.frm.controls['shippingNo'].setValue(this.shipAddress.id);
    this.frm.controls['shippingName'].setValue(this.shipAddress.value);
  }

  async getFields() {
    this.fields.forEach(
      x => {
        if (x.required) {
          this.frm.addControl(x.id,new FormControl(x.value,Validators.required));
        } else {
          this.frm.addControl(x.id,new FormControl(x.value));
        }
      }
    );
  }

  // methods
  getMethods() {
    // get item of the search component.
    // this.interceptService.getSearchObj$.subscribe(
    //   obj => {
    //     switch(obj.formControlName)
    //     {
    //       case 'customer':
    //         this.frm.controls['customerNo'].setValue(obj.item.id);
    //         this.frm.controls['customerName'].setValue(obj.item.name);
    //         break;
    //     }
    //     let objSearch = { show: false, title: '', name: '', data: [] };
    //     this.interceptService.searchShowFunc(objSearch);
    //   }
    // )
  }

}
