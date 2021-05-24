import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Guid } from 'guid-typescript';
import { ApiService } from '@svc/api.service';
import { GeneralService } from '@svc/general.service';
import { InterceptService } from '@svc/intercept.service';
import { JsonService } from '@svc/json.service';
import { SyncerpService } from '@svc/syncerp.service';
import { debug } from 'console';
import { ModuleService } from '@svc/gui/module.service';
import { E_PROCESSTYPE } from '@var/enums';
import { runInThisContext } from 'vm';
import { Module, Process } from '@mdl/module';
import { combineAll } from 'rxjs/operators';

@Component({
  selector: 'app-sales-form',
  templateUrl: './sales-form.page.html',
  styleUrls: ['./sales-form.page.scss']
})
export class SalesFormPage implements OnInit {
  private module: Module;
  private customers: any;
  private customer: any = {};
  private shipAddress: any;
  private items: any = {};
  private allItems: any = [];
  private categories: any;
  private listPrices: any = [];
  private salesType: string;

  new: boolean;
  edit: boolean = false;
  permissions: Array<E_PROCESSTYPE>;
  order: any = {};
  unitMeasureList: any = [];
  process: Process;
  
  frm = new FormGroup({});
  orderDate: string = new Date().toDateString();
  deliveryDate: string = new Date().toDateString();
  fields: Array<any> = [];
  linesS: Array<any> = [];
  today: string;
  subTotal: Number = 0;
  taxTotal: Number = 0;
  discountTotal: Number = 0;
  total: Number = 0;

  // viewChild
  @ViewChild('dateOrder') dateOrderTime;
  @ViewChild('dateDelivery') dateDeliveryTime;

  constructor(
    private apiConnect: ApiService,
    private formBuilder: FormBuilder,
    private intServ: InterceptService,
    private syncerp: SyncerpService,
    private general: GeneralService,
    private js: JsonService,
    private route: ActivatedRoute,
    private router: Router,
    private jsonServ: JsonService,
    private barcodeScanner: BarcodeScanner,
    private moduleService: ModuleService
  ) { 
    
    this.module = this.moduleService.getSelectedModule();
    this.process = this.moduleService.getSelectedProcess();
    this.salesType = this.process.salesType;
    this.permissions = this.process.sysPermits;
    if (this.permissions.indexOf(E_PROCESSTYPE.Edit)) this.edit = true;

    this.route.queryParams.subscribe(async params => {
      if (this.router.getCurrentNavigation().extras.state){
        this.new = this.router.getCurrentNavigation().extras.state.new;
        if (this.new) {
          this.customer = this.router.getCurrentNavigation().extras.state.customer;
          await this.initNew();
          await this.setCustomer();
        } else {
          this.order = this.router.getCurrentNavigation().extras.state.order;
          await this.initForm();
          await this.initSalesOrder();
        }
      } else {
        this.initNew();
        this.router.navigate(['modules']);
      }
    });
  }

  async ngOnInit() {}

  async ionViewWillEnter() {
    this.intServ.loadingFunc(true);
    await this.getCustomers();
    await this.getCategories();
    this.editSales();
    this.intServ.loadingFunc(false);
  }

  // Create new sale
  async initNew() {
    await this.initForm();
    // Fill
    this.today = new Date().toISOString()
    this.frm.controls.orderDate.setValue(this.today);
    this.frm.controls.requestedDeliveryDate.setValue(this.today);    
    this.getMethods();
  }

  /**
   * Initializate form
   */
  async initForm() {
    let guid: any = Guid.create();
    this.frm.addControl('id', new FormControl(guid.value));
    this.frm.addControl('shippingName', new FormControl("", Validators.required));
    this.frm.addControl('shippingNo', new FormControl("", Validators.required));
    this.frm.addControl('customerNo', new FormControl("", Validators.required));
    this.frm.addControl('customerName', new FormControl(""));
    this.frm.addControl('orderDate', new FormControl(""));
    this.frm.addControl('requestedDeliveryDate', new FormControl(""));
    // this.frm.addControl('lines', this.formBuilder.array([this.initLines()]));
    this.frm.addControl('lines', this.formBuilder.array([]));
  }

  /**
   * Get sales
   */
  async initSalesOrder() {
    this.frm.controls.shippingName.setValue(this.order.fields.ShiptoName);
    this.frm.controls.shippingNo.setValue(this.order.fields.ShiptoCode);
    this.frm.controls.customerNo.setValue(this.order.fields.SelltoCustomerNo);
    this.frm.controls.customerName.setValue(this.order.fields.SelltoCustomerName);
    this.frm.controls.orderDate.setValue(this.order.fields.OrderDate);
    this.frm.controls.requestedDeliveryDate.setValue(this.order.fields.RequestedDeliveryDate);
    this.frm.addControl('lines', this.formBuilder.array([]));
    this.frm.controls.lines = await this.setSalesOrderLines(this.order.lines);
    this.setTotals();
  }

  async editSales(){
    if (this.edit) {
      if (this.frm.controls.customerNo.value !== '') {
        this.customer = this.customers.find(x => x.id === this.frm.controls.customerNo.value);
        if (this.customer.shipAddress !== undefined) {
          if (this.customer.shipAddress.length === 0) {
            this.shipAddress = this.customer.shipAddress[0];
          } else {
            this.shipAddress = this.customer.shipAddress.find(x => x.id === this.frm.controls.shippingNo.value);
          }
        }
      }
    }
  }

  initLines() {
    return this.formBuilder.group({
      title: [''],
      quantity: 1,
      unitPrice: 0.00,
      total: 0.00
    });
  }

  /**
   * load search component
   */
  onCustomer() {
    if (this.frm.controls.lines.value.length < 1) {
      let obj = this.general.structSearch(this.customers, 'Search customers', 'Customers', (item) => {
        this.customer = item;
        this.setCustomer();
      });
      this.intServ.searchShowFunc(obj);
    } else {
      this.intServ.alertFunc(this.js.getAlert('alert', 'Alert', 'Customer cannot be changed because has items on order'));
    }
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
    if (this.customer === undefined || (this.customer.shipAddress === undefined || this.customer.shipAddress.length < 1) || this.shipAddress === undefined) {
      this.intServ.alertFunc(this.js.getAlert('alert', 'Alert', 'Please, select any customer and ship-to address'));
    } else {
      let obj = this.general.structSearch(this.categories, 'Search category', 'Categories', async (category) => {
        await this.itemsPerCategory(category);
      }, false);
      this.intServ.searchShowFunc(obj);
    }
  }

  onDeleteLine(i) {
    let lines: any = this.frm.controls.lines;
    lines.removeAt(i);
    // this.frm.controls.lines.setValue(lines);
    this.setTotals();
  }

  onIncDec(i, dec) {
    let lines = this.frm.controls.lines.value;
    if (dec === 0 && lines[i].quantity !== 1) {
      lines[i].quantity -= 1;
    } else if (dec === 1) {
      lines[i].quantity += 1;
    }
    let subTotal = lines[i].quantity * lines[i].unitPrice;
    let discountAmount = subTotal * (lines[i].lineDiscountPercentage / 100);
    lines[i].lineDiscountAmount = discountAmount.toFixed(2);
    lines[i].totalWithoutDiscount = subTotal.toFixed(2);
    lines[i].total = Number(subTotal - discountAmount).toFixed(2);
    this.frm.controls.lines.setValue(lines);
    this.setTotals();
  }

  ionMeasure(i) {
    let lineDiscount: Number = 0;
    let val: any = event.target;
    let lines = this.frm.controls.lines.value;
    let price = this.listPrices[i].find(x => (x.UnitofMeasureCode == val.value));
    
    if (price === undefined) {
      lines[i].unitPrice = 0
      lines[i].lineDiscountPercentage = 0;
      lineDiscount = 0;
    } else {
      lineDiscount = (lineDiscount === null) ? 0 : Number(lineDiscount);
      lines[i].unitPrice = price.UnitPrice;
      lines[i].lineDiscountPercentage = lineDiscount;
    }
    let totalWithoutDiscount = Number(Number(lines[i].quantity * lines[i].unitPrice).toFixed(2));
    let discount = totalWithoutDiscount * (Number(lineDiscount) / 100 );
    let total = totalWithoutDiscount - discount;
    lines[i].lineDiscountAmount = discount;
    lines[i].totalWithoutDiscount = totalWithoutDiscount;
    lines[i].total = total;
    this.frm.controls.lines.setValue(lines);
    this.setTotals();
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

  // camera bar code
  onBarCode() {
    this.barcodeScanner.scan().then(
      barCodeData => {
        let code = barCodeData.text;
        let item = this.allItems.find(x => x.id === code);
        this.addItem(item);
      }
    ).catch(
      err => {
        console.log(err);
      }
    )
  }

  /**
   * Change date
   * @param n 
   */
  onDate(n) {
    if (this.new || this.edit) {
      if(n === 0) this.dateOrderTime.open();
      if(n === 1) this.dateDeliveryTime.open();
    }
  }

  // login to the application is performed.
  onSubmit() {
    let process: any;
    this.intServ.loadingFunc(true);
    try {
      if (this.frm.valid) {
        this.jsonServ.formToJson(this.frm, ['picture', 'shippingName', 'customerName', 'categoryNo', 'title']).then(
          async json => {
            json['salesPerson'] = this.module.erpUserId;
            json['orderDate'] = json['orderDate'].substring(0, 10);
            json['documentType'] = this.salesType;
            json['postingDate'] = json.orderDate;
            json['documentDate'] = json.orderDate;
            json['requestedDeliveryDate'] = json.requestedDeliveryDate.substring(0, 10);
            if (!this.new) {
              json['documentNo'] = this.order.fields.No;
              process = await this.syncerp.processRequestParams('UpdateSalesOrders', [json]);
            } else
              process = await this.syncerp.processRequestParams('ProcessSalesOrders', [json]);
            if (json.lines.length > 0) {
              let salesOrder = await this.syncerp.setRequest(process);
              this.intServ.loadingFunc(false);
              if (salesOrder.error !== undefined) {
                this.intServ.alertFunc(this.js.getAlert('error', 'Error', `${salesOrder.error.message}`));
              } else {
                this.frm.reset();
                this.intServ.alertFunc(this.js.getAlert('success', 'Success', `The order No. ${salesOrder.SalesOrder} has been created successfully`, () => {
                  this.router.navigate(['modules']);
                }));
              }
            } else {
              this.intServ.alertFunc(this.js.getAlert('alert', 'Alert', `This order does not have lines`));
              this.intServ.loadingFunc(false);
            }
          }
        )
      } else {
        this.intServ.loadingFunc(false);
      } 
    } catch (error) {
      this.intServ.loadingFunc(false);
    }
  }

  /**
   * calcule totals
   */
  setTotals() {
    let lines = this.frm.controls.lines.value;
    this.subTotal = 0;
    this.discountTotal = 0;
    this.total = 0;
    for (let i in lines) {
      this.subTotal = Number((Number(this.subTotal) + Number(lines[i].totalWithoutDiscount)).toFixed(2));
      this.discountTotal = Number((Number(this.discountTotal) + Number(lines[i].lineDiscountAmount)).toFixed(2));
    }
    this.total = Number((Number(this.subTotal) - Number(this.discountTotal)).toFixed(2));
  }

  /**
   * Items by category
   * @param category 
   */
  async itemsPerCategory(category) {
    this.items = category.items;
    let obj = this.general.structSearch(this.items, 'Search item', 'Items', async (item) => {
      await this.addItem(item);
    }, false);
    this.intServ.searchShowFunc(obj);
  }

  /**
   * Add item to the cart
   * @param item 
   */
  async addItem(item) {
    var now = new Date();
    item['unitPrice'] = 0;
    item['discountPerc'] = 0;
    item['total'] = 0;
    item['measure'] = item.fields.SalesUnitofMeasure;
    item['priceListC'] = [];
    item.listPrice.forEach(x => {
      let sDate = (x.fields.StartingDate !== null) ? x.fields.StartingDate.split('-') : null;
      let eDate = (x.fields.EndingDate !== null) ?x.fields.EndingDate.split('-') : null;

      let startDate = (sDate !== null) ? new Date(sDate[0] + '/' + sDate[1] + '/' + sDate[2] + ' 00:00:00') : null;
      let endDate = (eDate !== null) ? new Date(eDate[0] + '/' + eDate[1] + '/' + eDate[2] + ' 23:59:59') : null;

      if ((now >= startDate || startDate === null) && (now <= endDate || endDate === null) && item['unitPrice'] === 0) {
        item.priceListC.push(x.fields);
        if (x.fields.UnitofMeasureCode == item.measure) {
          item['unitPrice'] = Number(x.fields.UnitPrice).toFixed(2);
          if (x.fields['LineDiscount%'] !== null) {
            item['unitPrice'] = Number(x.fields.UnitPrice).toFixed(2);            
            item['discountPerc'] = x.fields['LineDiscount%'];
            item['total'] = Number((item['unitPrice'] - (item['unitPrice'] * (item['discountPerc'] / 100))).toFixed(2));
          } else {
            item['unitPrice'] = Number(x.fields.UnitPrice).toFixed(2);
            item['discountPerc'] = 0;
            item['total'] = item['unitPrice'];
          }
        }
      }
    });
    if (item.unitPrice === 0) {
      item['measure']
      item['unitPrice'] = item.fields.unitPrice;
    }
    item['quantity'] = 1;
    this.linesS.push(item);
    this.frm.controls.lines = this.setLines(item);
    this.setTotals();
    this.intServ.searchShowFunc({});
  }

  Test(){
    alert(1);
  }

  // lines in new item
  setLines(item) {
    let arr = new FormArray([]);
    if (this.frm.controls.lines.value.length > 0) {
      this.frm.controls.lines.value.forEach(
        line =>{
          arr.push(this.formBuilder.group(line));
        }
      )
    }
    let discountPerc = (item.discountPerc) ? 0 : item.discountPerc;
    let discountAmount = item.total * (discountPerc / 100);
    arr.push(
      this.formBuilder.group({
        title: item.value,
        id: item.id,
        type: item.fields.Type,
        categoryNo: item.id,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.total - discountAmount,
        totalWithoutDiscount: item.total,
        picture: `data:image/jpeg;base64,${item.fields.Picture}`,
        unitOfMeasureCode: item.measure,
        lineDiscountAmount: discountAmount,
        lineDiscountPercentage: item.discountPerc
      })
    );
    this.unitMeasureList[arr.length - 1] = item.unitOfMeasures;
    this.listPrices[arr.length - 1] = item.priceListC;
    return arr;  
  }

  // view sales order
  async setSalesOrderLines(lines) {
    let arr = new FormArray([]);
    for(let i in lines) {
      let item = await this.allItems.find(x => (x.id === lines[i].id));
      arr.push(
        this.formBuilder.group({
          title: lines[i].value,
          id: lines[i].id,
          type: lines[i].fields.Type,
          categoryNo: '',
          quantity: lines[i].fields.Quantity,
          unitPrice: lines[i].fields.UnitPrice,
          total: lines[i].fields.Amount,
          totalWithoutDiscount: lines[i].fields.Amount + lines[i].fields.LineDiscountAmount,
          picture: (item !== undefined) ? `data:image/jpeg;base64,${item.fields.Picture}` : 'data:image/jpeg;base64,NOIMAGE',
          unitOfMeasureCode: lines[i].fields.UnitofMeasureCode,
          lineDiscountAmount: lines[i].fields.LineDiscountAmount,
          lineDiscountPercentage: 0
        })
      );
    }
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
    let process = await this.syncerp.processRequest('GetCustomers', "0", "", this.module.erpUserId);
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
    console.log(this.categories);
    this.categories.forEach(
      category => {
        category.items.forEach(
          item => {
            this.allItems.push(item);
          }
        )
      }
    );
  }

  async setCustomer() {
    this.frm.controls['customerNo'].setValue(this.customer.id);
    this.frm.controls['customerName'].setValue(this.customer.value);
    if (this.customer.shipAddress.length < 1) {
      this.intServ.alertFunc(this.js.getAlert('alert', 'alert', `This customer does not have ship-to Address`));
      this.clearShipAdress();
    }
  }

  setShipAdress() {
    this.frm.controls['shippingNo'].setValue(this.shipAddress.id);
    this.frm.controls['shippingName'].setValue(this.shipAddress.value);
  }

  /**
   * Clear Ship-to Address
   */
  clearShipAdress() {
    this.frm.controls['shippingNo'].setValue('');
    this.frm.controls['shippingName'].setValue('');
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
