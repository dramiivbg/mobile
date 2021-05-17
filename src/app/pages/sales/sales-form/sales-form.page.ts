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
  private allItems: any = [];
  private categories: any;
  private listPrices: any = [];
  private salesType: string;

  new: boolean;
  process: any = {};
  order: any = {};
  unitMeasureList: any = [];
  
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
    private barcodeScanner: BarcodeScanner
  ) { 
    this.route.queryParams.subscribe(async params => {
      if (this.router.getCurrentNavigation().extras.state){
        this.new = this.router.getCurrentNavigation().extras.state.new;
        if (this.new) {
          this.customer = this.router.getCurrentNavigation().extras.state.customer;
          this.process = this.router.getCurrentNavigation().extras.state.process;
          this.salesType = this.router.getCurrentNavigation().extras.state.salesType;
          await this.initNew();
          await this.setCustomer();
        } else {
          this.process = this.router.getCurrentNavigation().extras.state.process;
          this.order = this.router.getCurrentNavigation().extras.state.order;
          this.salesType = this.router.getCurrentNavigation().extras.state.salesType;
          await this.initForm();
          await this.initSalesOrder();
        }
      } else {
        this.initNew();
        this.router.navigate(['modules']);
      }
    });
  }

  async ngOnInit() {
    this.intServ.loadingFunc(true);
    await this.getCustomers();
    // await this.getItems();
    await this.getCategories();
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

  // Get sales
  async initSalesOrder() {
    this.frm.controls.shippingName.setValue(this.order.fields.ShiptoName);
    this.frm.controls.shippingNo.setValue(this.order.fields.ShiptoCode);
    this.frm.controls.customerNo.setValue(this.order.fields.SelltoCustomerNo);
    this.frm.controls.customerName.setValue(this.order.fields.SelltoCustomerName);
    this.frm.controls.orderDate.setValue(this.order.fields.DocumentDate);
    this.frm.controls.requestedDeliveryDate.setValue(this.order.fields.RequestedDeliveryDate);
    this.frm.addControl('lines', this.formBuilder.array([]));
    this.frm.controls.lines = await this.setSalesOrderLines(this.order.lines);
    this.setTotals();
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
    console.log(this.shipAddress);
    if (this.customer === undefined || this.shipAddress === undefined) {
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
    lines[i].lineDiscountAmount = discountAmount;
    lines[i].totalWithoutDiscount = subTotal.toFixed(2);
    lines[i].total = Number(subTotal - discountAmount).toFixed(2);
    this.frm.controls.lines.setValue(lines);
    this.setTotals();
  }

  ionMeasure(i) {
    let val: any = event.target;
    let lines = this.frm.controls.lines.value;
    let price = this.listPrices[i].find(x => (x.UnitofMeasureCode == val.value));
    
    lines[i].unitPrice = price.UnitPrice;
    lines[i].lineDiscountPercentage = (price['LineDiscount%'] === null) ? 0 : Number(price['LineDiscount%']);
    let totalWithoutDiscount = Number(Number(lines[i].quantity * lines[i].unitPrice).toFixed(2));
    let discount = totalWithoutDiscount * (price['LineDiscount%'] / 100 );
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

  onDate(n) {
    if (this.new) {
      if(n === 0) this.dateOrderTime.open();
      if(n === 1) this.dateDeliveryTime.open();
    }
  }

  // login to the application is performed.
  onSubmit() {
    this.intServ.loadingFunc(true);
    try {
      if (this.frm.valid) {
        this.jsonServ.formToJson(this.frm, ['picture', 'shippingName', 'customerName', 'categoryNo', 'title']).then(
          async json => {
            json['orderDate'] = json['orderDate'].substring(0, 10);
            json['documentType'] = this.salesType;
            json['postingDate'] = json.orderDate;
            json['documentDate'] = json.orderDate;
            json['requestedDeliveryDate'] = json.requestedDeliveryDate.substring(0, 10);
            let process = await this.syncerp.processRequestParams('ProcessSalesOrders', [json]);
            console.log(JSON.stringify(process));
            let salesOrder = await this.syncerp.setRequest(process);
            this.intServ.loadingFunc(false);
            if (salesOrder.error !== undefined) {
              this.intServ.alertFunc(this.js.getAlert('error', 'Error', `${salesOrder.error.message}`));
            } else {
              this.intServ.alertFunc(this.js.getAlert('success', 'Success', `The order No. ${salesOrder.SalesOrder} has been created successfully`, () => {
                this.router.navigate(['modules']);
              }));
            }
          }
        )
      } else {
        this.intServ.loadingFunc(false);
      } 
    } catch (error) {
      
    }
  }

  // calcule totals
  setTotals() {
    let lines = this.frm.controls.lines.value;
    this.subTotal = 0;
    this.discountTotal = 0;
    this.total = 0;
    for (let i in lines) {
      this.subTotal = Number(this.subTotal) + Number(lines[i].totalWithoutDiscount);
      this.discountTotal = Number(this.discountTotal) + Number(lines[i].lineDiscountAmount);
    }
    this.total = Number((Number(this.subTotal) - Number(this.discountTotal)).toFixed(2));
  }

  async itemsPerCategory(category) {
    this.items = category.items;
    let obj = this.general.structSearch(this.items, 'Search item', 'Items', async (item) => {
      await this.addItem(item);
    }, false);
    this.intServ.searchShowFunc(obj);
  }

  // Add item to the cart
  async addItem(item) {
    var now = new Date();
    item['unitPrice'] = 0.00;
    item['total'] = 0.00;
    item['measure'] = item.unitOfMeasures[0].id;
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
            item['total'] = item['unitPrice'];
          } else {
            item['unitPrice'] = Number(x.fields.UnitPrice).toFixed(2);
            item['discountPerc'] = 0;
            item['total'] = item['unitPrice'];
          }
        }
      }
    });
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
          totalWithoutDiscount: lines[i].fields.Amount,
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
