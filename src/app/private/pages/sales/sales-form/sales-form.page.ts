import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Guid } from 'guid-typescript';
import { ApiService } from '@svc/api.service';
import { GeneralService } from '@svc/general.service';
import { InterceptService } from '@svc/intercept.service';
import { JsonService } from '@svc/json.service';
import { SyncerpService } from '@svc/syncerp.service';
import { ModuleService } from '@svc/gui/module.service';
import { E_PROCESSTYPE } from '@var/enums';
import { Module, Process } from '@mdl/module';
import { Storage } from '@ionic/storage';
import { SK_OFFLINE } from '@var/consts';
import * as moment from 'moment';
import { debuglog } from 'util';
import { PopoverController } from '@ionic/angular';
import { PopoverCountingComponent } from '@prv/components/popover-counting/popover-counting.component';
import { WmsService } from '@svc/wms.service';

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
  private extras: boolean = false;
  private vatPostingSetup: any;
  private locationMandatory: boolean;
  private customerLocationCode: string = '';
  private routExtras: any;
  public disabled = false;
  public locationSetup: any;
  public new: boolean;
  public edit: boolean = false;
  public backObj: any = {};
  public permissions: Array<E_PROCESSTYPE>;
  public order: any = {};
  public temp: any = {};
  public unitMeasureList: any = [];
  
  public listEditShip = [];
  public idSales: string;
  public hideShipTo: boolean = false;
  public hideOrderDate: boolean = false;
  public frm = new UntypedFormGroup({});
  public orderDate: string = new Date().toDateString();
  public deliveryDate: string = new Date().toDateString();
  public fields: Array<any> = [];
  public linesS: Array<any> = [];
  public today: string;
  public subTotal: Number = 0;
  public taxTotal: Number = 0;
  public discountTotal: Number = 0;
  public total: Number = 0;
  public contador = 0;

  public process: Process = {
    processId: '',
    description: '',
    permissions: [],
    salesType: '',
    sysPermits: []
  };

  // viewChild
  @ViewChild('dateOrder') dateOrderTime;
  @ViewChild('dateDelivery') dateDeliveryTime;

  constructor(private apiConnect: ApiService
    , private formBuilder: UntypedFormBuilder
    , private intServ: InterceptService
    , private syncerp: SyncerpService
    , private general: GeneralService
    , private js: JsonService
    , private route: ActivatedRoute
    , private router: Router
    , private jsonServ: JsonService
    , private barcodeScanner: BarcodeScanner
    , private moduleService: ModuleService
    , private storage: Storage
    , public popoverController: PopoverController
    ,public wmsService: WmsService

  ) { 
    let objFunc = {
      func: () => {
        this.onBack();
      }
    };
    this.intServ.appBackFunc(objFunc);
    this.route.queryParams.subscribe(async params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.routExtras = this.router.getCurrentNavigation().extras;
       
        this.getConstructor();
      } else {
        this.initNew();
        this.router.navigate(['page/main/modules'], { replaceUrl: true });
      }
    });
  }

  async ngOnInit() {
  }

  async ionViewWillEnter() {
    let offline = await this.storage.get(SK_OFFLINE);
    this.onReset();
    if (this.extras) {
     this.intServ.loadingFunc(true);
      await this.getBC();
      if (!this.new) await this.initSalesOrder();
      this.editSales();
      if (this.order !== undefined) {
        if (offline && this.edit && !this.new) {
          this.intServ.alertFunc(this.js.getAlert('alert', 'Alert', 'You do not have a connection available for editing.'));
          this.edit = !offline;
        }
      }
      this.intServ.loadingFunc(false);
    }
    this.onBackFunction();
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
    this.frm.addControl('id', new UntypedFormControl(guid.value));
    this.frm.addControl('shippingName', new UntypedFormControl(""));
    this.frm.addControl('shippingNo', new UntypedFormControl(""));
    this.frm.addControl('customerNo', new UntypedFormControl("", Validators.required));
    this.frm.addControl('customerName', new UntypedFormControl(""));
    this.frm.addControl('orderDate', new UntypedFormControl(""));
    this.frm.addControl('requestedDeliveryDate', new UntypedFormControl(""));
    // this.frm.addControl('lines', this.formBuilder.array([this.initLines()]));
    this.frm.addControl('lines', this.formBuilder.array([]));

    console.log('order =>',this.order);

  }

  /**
   * Get sales
   */
  async initSalesOrder() {
    if (this.order !== undefined) {
      let requestDeliveryDate = this.order.fields.RequestedDeliveryDate === null ? this.order.fields.OrderDate : this.order.fields.RequestedDeliveryDate;
      this.idSales = this.order.id;
      if (!this.hideShipTo) {
        const shipToCode = this.order.fields.ShiptoCode === null ? '': this.order.fields.ShiptoCode;
        const shipToName = this.order.fields.ShiptoCode === null ? '': this.order.fields.ShiptoName;
        this.frm.controls.shippingName.setValue(shipToName);
        this.frm.controls.shippingNo.setValue(shipToCode);
      }
      this.frm.controls.customerNo.setValue(this.order.fields.SelltoCustomerNo);
      this.frm.controls.customerName.setValue(this.order.fields.SelltoCustomerName);
      this.frm.controls.orderDate.setValue(this.order.fields.OrderDate);
      this.frm.controls.requestedDeliveryDate.setValue(requestDeliveryDate);
      this.frm.addControl('lines', this.formBuilder.array([]));
      this.frm.controls.lines = await this.setSalesOrderLines(this.order.lines);
      this.setTotals();
    } else {
      this.idSales = this.temp.id;
      this.frm.controls.id.setValue(this.temp.parameters.id);
      if (!this.hideShipTo) {
        this.frm.controls.shippingName.setValue(this.temp.parameters.shippingName);
        this.frm.controls.shippingNo.setValue(this.temp.parameters.shippingNo);
      }
      this.frm.controls.customerNo.setValue(this.temp.parameters.customerNo);
      this.frm.controls.customerName.setValue(this.temp.value);
      this.frm.controls.orderDate.setValue(this.temp.parameters.orderDate);
      this.frm.controls.requestedDeliveryDate.setValue(this.temp.parameters.requestedDeliveryDate);
      this.frm.addControl('lines', this.formBuilder.array([]));
      this.frm.controls.lines = await this.setTempSalesLines(this.temp.parameters.lines);
      this.setTotals();
    }
  }

  /**
   * Edit salesonBarCode()
   */
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

  onReset() {
    this.fields = [];
    this.linesS = [];
    this.today = '';
    this.subTotal = 0;
    this.taxTotal = 0;
    this.discountTotal = 0;
    this.total = 0;
    this.unitMeasureList = [];
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

      console.log('item =>', obj);
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
  onCategoryItem() {
    if (this.hideShipTo) {
      let obj = this.general.structSearch(this.categories, 'Search category', 'Categories', async (category) => {
        await this.itemsPerCategory(category);
      }, false);
      this.intServ.searchShowFunc(obj);
    } else if (this.customer === undefined || (this.customer.shipAddress === undefined || this.customer.shipAddress.length < 1) || this.shipAddress === undefined) {
      this.intServ.alertFunc(this.js.getAlert('alert', 'Alert', 'Please, select any customer and ship-to address'));
    } else {
      let obj = this.general.structSearch(this.categories, 'Search category', 'Categories', async (category) => {
        await this.itemsPerCategory(category);
      }, false);
      this.intServ.searchShowFunc(obj);
    }
  }

  // on click - search items
  async onItem() {
    if (this.items !== null && this.items !== undefined && this.items.length > 0) {
      this.getItemsList();
    } else {
      this.intServ.alertFunc(this.js.getAlert('alert', 'Alert', 'No items found'));
    }
  }


 async  popoverPicking(i,item: any,automate:boolean = false){

     automate = this.disabled?false:automate; 
    const popover = await this.popoverController.create({
      component: PopoverCountingComponent,
      cssClass: 'popoverCountingComponent',
      componentProps: {list:item.value, picking:true,automate},
      backdropDismiss: false
      
    });
    await popover.present();
    const { data } = await popover.onDidDismiss();

   if(data.qtyToShip != undefined){
    item.value.quantity = data.qty;
    switch(data.qtyToShip <= item.value.quantity){

      case true:
        console.log(data.qtyToShip);

        let lines = this.frm.controls.lines.value;
        console.log('line =>',lines[i]);
        lines[i].qtytoShip = data.qtyToShip;
         lines[i].quantity = data.qty;         
          let subTotal =  data.qtyToShip * lines[i].unitPrice
          let discountAmount = subTotal * (lines[i].lineDiscountPercentage / 100);
          lines[i].lineDiscountAmount = discountAmount.toFixed(2);
          lines[i].totalWithoutDiscount = subTotal.toFixed(2);
          lines[i].total = Number(subTotal  - discountAmount).toFixed(2);
          this.frm.controls.lines.setValue(lines); 
          if(this.disabled)this.listEditShip.push(lines[i]);

          this.setTotals();    
        console.log(this.listEditShip);

        console.log(this.frm.controls.lines);
      break;

      default:
        this.intServ.alertFunc(this.js.getAlert('alert', '', 'Qty To ship must not be greater than Quantity'));
        break;
    }
 
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
   // console.log('lines =>', lines[i].quantity);
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

  async onQuantity(i) {
    let lines = this.frm.controls.lines.value;
    let subTotal = lines[i].quantity * lines[i].unitPrice;
    let discountAmount = subTotal * (lines[i].lineDiscountPercentage / 100);
    lines[i].lineDiscountAmount = discountAmount.toFixed(2);
    lines[i].totalWithoutDiscount = subTotal.toFixed(2);
    lines[i].total = Number(subTotal - discountAmount).toFixed(2);
    this.frm.controls.lines.setValue(lines);
    this.setTotals();
  }

  ionMeasure(i) {

    console.log('i =>', i)
    let lineDiscount: Number = 0;
    let val: any = event.target;
    let lines = this.frm.controls.lines.value;
    let price = this.listPrices[i].find(x => (x.UnitofMeasureCode === val.value));
    if (price === undefined) {
      price = this.listPrices[i].find(x => (x.UnitofMeasureCode === null));
    }
    
    if (price === undefined) {
      lines[i].unitPrice = 0
      lines[i].lineDiscountPercentage = 0;
      lineDiscount = 0;
    } else {
      lineDiscount = price['LineDiscount%'];
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
              this.frm.addControl(x.id,new UntypedFormControl("",Validators.required));
            } else {
              this.frm.addControl(x.id,new UntypedFormControl(""));
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
        let items = this.frm.get('lines')['controls'];

        let item = this.items.find(x => x.id.toUpperCase() === code.toUpperCase());
        let find  = items.find(x => x.value.id.toUpperCase() === item.id.toUpperCase());
       // console.log(item);

       if(find === undefined)this.addItem(item);

       let items2 = this.frm.get('lines')['controls'];
       console.log(items2);
        let obj  = items2.find(x => x.value.id.toUpperCase() === item.id.toUpperCase());
        let index = items2.indexOf(items2.find(x => x.value.id.toUpperCase() === item.id.toUpperCase()));
        console.log(index);
        let automate = true;
        this.popoverPicking(index,obj,automate);

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

  /**
   * Return to the main.
   */
   onBack() {
    if (this.new || this.edit) {
      this.intServ.alertFunc(this.js.getAlert('confirm', 'Confirm', 'Are you sure you want to leave?',
        () => {
          this.onReset();
          this.router.navigate(['page/sales/page'], { replaceUrl: true });
        }
      ));
    } else {
      this.router.navigate(['page/sales/page'], { replaceUrl: true });
    }
  }

  /**
   * Return to the main.
   */
  onBackFunction() {
    this.backObj = {
      func: () => {
        if (this.new || this.edit) {
          this.intServ.alertFunc(this.js.getAlert('confirm', 'Confirm', 'Are you sure you want to leave?',
            () => {
              this.onReset();
              this.router.navigate(['page/sales/page'], { replaceUrl: true });
            }
          ));
        } else {
          this.router.navigate(['page/sales/page'], { replaceUrl: true });
        }
      }
    }
  }

  /**
   * Edit Line and change value
   * @param e @event
   * @param i @line
   */
  async onChangePrice(e, i) {
    let val = e.target.value === '' ? 0 : e.target.value;
    let lines = this.frm.controls.lines.value;
    lines[i].unitPrice = Number(val);
    let subTotal = lines[i].quantity * lines[i].unitPrice;
    let discountAmount = subTotal * (lines[i].lineDiscountPercentage / 100);
    lines[i].lineDiscountAmount = discountAmount.toFixed(2);
    lines[i].totalWithoutDiscount = subTotal.toFixed(2);
    lines[i].total = Number(subTotal - discountAmount).toFixed(2);
    // let tax = (lines[i].totalWithoutDiscount) * ( taxPerc / 100);
    lines[i].edit = true;
    this.frm.controls.lines.setValue(lines);
    this.setTotals();
  }

  /**
   * Edit Line and change value
   * @param e @event
   * @param i @line
   */
   async onChangeDiscount(e, i) {

    console.log('i =>',i);
    console.log('e =>',e);
    let val = e.target.value === '' ? 0 : e.target.value;
    let lines = this.frm.controls.lines.value;
    lines[i].lineDiscountPercentage = Number(val);
    let subTotal = lines[i].quantity * lines[i].unitPrice;
    let discountAmount = subTotal * (lines[i].lineDiscountPercentage / 100);
    lines[i].lineDiscountAmount = discountAmount.toFixed(2);
    lines[i].totalWithoutDiscount = subTotal.toFixed(2);
    lines[i].total = Number(subTotal - discountAmount).toFixed(2);
    // let tax = (lines[i].totalWithoutDiscount) * ( taxPerc / 100);
    lines[i].edit = true;
    this.frm.controls.lines.setValue(lines);
    this.setTotals();
  }

  /**
   * Send Sales
   */
  public async onSubmit() {
    // let momentNow = moment().format('yyyy-MM-DD');
    let mandatoryBoolean: boolean;
    let process: any;
    this.intServ.loadingFunc(true);
    try {
      mandatoryBoolean = await this.validMandatory();
      if (this.frm.valid && mandatoryBoolean) {
      // if (this.frm.valid) {
        this.jsonServ.formToJson(this.frm, ['picture', 'categoryNo', 'title']).then(
          async json => {
            if (this.order === undefined || this.order === null) {
              json['SalesOrder'] = this.temp.id;
            }
            json['salesPerson'] = this.module.erpUserId;
            json['paymentMethod'] = '';
            json['orderDate'] = json['orderDate'].substring(0, 10);
            json['documentType'] = this.salesType;
            json['postingDate'] = json['orderDate'].substring(0, 10);
            json['documentDate'] = json['orderDate'].substring(0, 10);
            json['requestedDeliveryDate'] = json.requestedDeliveryDate.substring(0, 10);
            if (!this.new) {
              if (this.order !== undefined && this.order !== null) {
                json['documentNo'] = this.order.fields.No;
                json['genBusinessPostingGroup'] = this.order.genBusinessPostingGroup;
                process = await this.syncerp.processRequestParams('UpdateSalesOrders', [json]);
              } else {
                json['genBusinessPostingGroup'] = this.temp.parameters.genBusinessPostingGroup;
                process = await this.syncerp.processRequestParams('ProcessSalesOrders', [json]);
              }
            } else {
              json['genBusinessPostingGroup'] = this.customer.genBusinessPostingGroup;
              process = await this.syncerp.processRequestParams('ProcessSalesOrders', [json]);
            }


              if (json.lines.length > 0) {

                let list = [];
          if(this.disabled){

            this.listEditShip.filter(item => {

              let obj = {
                DocumentType: this.process.description == "Sales Order"?"1":this.process.description == "Sales Return Order"?"5":this.process.description == "Sales Invoice"?"2":"3",
                DocumentNo: this.order.id, 
                LineNo: item.LineNo,
                No: item.No, 
                QtytoShip: item.qtytoShip
               }

               list.push(obj);
               obj.DocumentType =  "",
                obj.DocumentNo =  "", 
                obj.LineNo = "",
                obj.No = "", 
                obj.QtytoShip = ""
               
            });

          }
           
              

                let salesOrder = !this.disabled?await this.syncerp.setRequest(process): this.wmsService.Update_QtyToShip_SalesLines_V1(list);
    
                this.intServ.loadingFunc(false);
                if (salesOrder.error !== undefined) {
                  this.intServ.alertFunc(this.js.getAlert('error', 'Error', `${salesOrder.error.message}`));
                } else {
                  if (this.new) {
                  
                    this.intServ.alertFunc(this.js.getAlert('success', 'Success', `The sales No. ${salesOrder.SalesOrder} has been created successfully`, () => {
                      this.router.navigate(['page/sales/main'], { replaceUrl: true });
                    }));
                  } else {
                    this.intServ.alertFunc(this.js.getAlert('success', 'Success', `The sales No. ${salesOrder.SalesOrder} has been successfully updated`, () => {
                      this.router.navigate(['page/sales/main'], { replaceUrl: true });
                    }));
                  }
                }
              } else {
                this.intServ.alertFunc(this.js.getAlert('alert', 'Alert', `This order does not have lines`));
                this.intServ.loadingFunc(false);
              }

          
          }
        )
      } else if (!mandatoryBoolean) {
        this.intServ.loadingFunc(false);
        this.intServ.alertFunc(this.js.getAlert('alert', 'Alert', `This company has the location as a mandatory field, verify the items and fill in the location code.`));
      } else {
        this.intServ.loadingFunc(false);
        this.intServ.alertFunc(this.js.getAlert('error', 'Error', `Some errors have occurred when validating this data.`));
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
    this.taxTotal = 0;
    for (let i in lines) {
      let lineDiscount = Number(lines[i].lineDiscountAmount);
      let linePrice = Number(lines[i].totalWithoutDiscount);
      let taxPerc = lines[i].taxPerc;
      let priceWithDiscount = linePrice - lineDiscount;
      let tax = priceWithDiscount * (taxPerc  / 100);
      this.subTotal = Number((Number(this.subTotal) + linePrice).toFixed(2));
      this.discountTotal = Number((Number(this.discountTotal) + lineDiscount).toFixed(2));
      this.taxTotal = Number((Number(this.taxTotal) + tax).toFixed(2));
    }
    this.total = Number(((Number(this.subTotal) - Number(this.discountTotal)) + Number(this.taxTotal)).toFixed(2));
  }

  /**
   * Items by category
   * @param category 
   */
  async itemsPerCategory(category) {
    this.items = category.items;
    console.log(this.items);
    let obj = this.general.structSearch(this.items, 'Search item', 'Items', async (item) => {
      await this.addItem(item);
      if (item.error)
        this.intServ.alertFunc(this.js.getAlert('alert', 'Alert', 'The tax posting setup does not exist.'));
      else {
        this.intServ.alertFunc(this.js.getAlert('confirm', 'Confirm', 'Do you want to continue adding more items in the same category?',
          () => {
            this.itemsPerCategory(category);
          }
        ));
      }
    }, false);
    this.intServ.searchShowFunc(obj);
  }

  /**
   * Add item to the cart
   * @param item 
   */
  async addItem(item: any, newSales: boolean = true) {
    let genBusinessPostingGroup = '';
    if (this.new) {
      genBusinessPostingGroup = this.customer.genBusinessPostingGroup === undefined || 
                                this.customer.genBusinessPostingGroup === null ? '' : this.customer.genBusinessPostingGroup;
    } else {
      if (this.order !== undefined) {
        genBusinessPostingGroup = this.order.genBusinessPostingGroup === undefined || 
                                  this.order.genBusinessPostingGroup === null ? '' : this.order.genBusinessPostingGroup;
      } else {
        genBusinessPostingGroup = this.temp.parameters.genBusinessPostingGroup === undefined || 
                                  this.temp.parameters.genBusinessPostingGroup === null ? '' : this.temp.parameters.genBusinessPostingGroup;
      }
    }
    let genProdPostingGroup = item.genProdPostingGroup === undefined || 
                              item.genProdPostingGroup === null ? '' : item.genProdPostingGroup;
    var now = new Date();
    item['unitPrice'] = 0;
    item['discountPerc'] = 0;
    item['total'] = 0;
    item['measure'] = item.fields.SalesUnitofMeasure;
    item['priceListC'] = [];
    item['taxPerc'] = 0;
    item['error'] = false;
    let tax = this.vatPostingSetup.find(x => x.VATBusPostingGroup === genBusinessPostingGroup && x.VATProdPostingGroup === genProdPostingGroup);
    if (this.vatPostingSetup.length > 0) {
      if (tax !== undefined && tax !== null) {
        item['taxPerc'] = tax.VATPercentage;
      } else {
        item['error'] = true;
        return;
      }
    }
    // if (tax !== undefined && tax !== null) item['taxPerc'] = tax.VATPercentage; else item['taxPerc'] = 0;
    item.listPrice.forEach(x => {
      let sDate = (x.fields.StartingDate !== null) ? x.fields.StartingDate.split('-') : null;
      let eDate = (x.fields.EndingDate !== null) ?x.fields.EndingDate.split('-') : null;

      let startDate = (sDate !== null) ? new Date(sDate[0] + '/' + sDate[1] + '/' + sDate[2] + ' 00:00:00') : null;
      let endDate = (eDate !== null) ? new Date(eDate[0] + '/' + eDate[1] + '/' + eDate[2] + ' 23:59:59') : null;

      if ((now >= startDate || startDate === null) && (now <= endDate || endDate === null)) {
        item.priceListC.push(x.fields);
      }

      if ((now >= startDate || startDate === null) && (now <= endDate || endDate === null) && item['unitPrice'] === 0) {
        if (x.fields.UnitofMeasureCode == item.measure) {
          item['unitPrice'] = Number(x.fields.UnitPrice).toFixed(2);
          if (x.fields['LineDiscount%'] !== null) {
            item['unitPrice'] = Number(x.fields.UnitPrice).toFixed(2);            
            item['discountPerc'] = Number(x.fields['LineDiscount%']);
            item['total'] = Number(item['unitPrice']).toFixed(2);
            // item['total'] = Number((item['unitPrice'] - (item['unitPrice'] * (item['discountPerc'] / 100))).toFixed(2));
          } else {
            item['unitPrice'] = Number(x.fields.UnitPrice).toFixed(2);
            item['discountPerc'] = 0;
            item['total'] = item['unitPrice'];
          }
        }
      }
    });
    if (item.unitPrice === 0) {
      let nullPrice = item.listPrice.find(x => x.fields.UnitofMeasureCode === null);
      if (nullPrice !== undefined) {
        item['unitPrice'] = nullPrice.fields.UnitPrice === null ? 0 : nullPrice.fields.UnitPrice;
        item['discountPerc'] = Number(nullPrice.fields['LineDiscount%']);
        item['total'] = Number(item['unitPrice']).toFixed(2);
      } else {
        item['unitPrice'] = item.fields.UnitPrice === null ? 0 : item.fields.UnitPrice;
        item['discountPerc'] = 0;
        item['total'] = Number(item['unitPrice']).toFixed(2);
      }
    }
    item['quantity'] = 1;
    item['qtytoShip'] = 0;
    item['OutstandingQuantity'] = 0
    this.linesS.push(item);
    if (newSales) {
      this.frm.controls.lines = this.setLines(item);
      this.setTotals();
      this.intServ.searchShowFunc({});
    }
  }

  /**
   * set lines for news sales
   * @param item 
   * @returns 
   */
  setLines(item) {
    let locationCode: string = '';
    let arr = new UntypedFormArray([]);
    if (this.frm.controls.lines.value.length > 0) {
      this.frm.controls.lines.value.forEach(
        line =>{
          arr.push(this.formBuilder.group(line));
        }
      )
    }
    if (item.fields.Type === 'Inventory') {
      locationCode = (this.customer.fields.LocationCode === null || this.customer.fields.LocationCode === undefined) ? '' : this.customer.fields.LocationCode;
    }
    let discountPerc = (item.discountPerc === null) ? 0 : item.discountPerc;
    let taxPerc = (item.taxPerc === null) ? 0 : item.taxPerc;
    let discountAmount = item.total * (discountPerc / 100);
    let tax = (item.total - discountAmount) * ( taxPerc / 100);
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
        lineDiscountPercentage: item.discountPerc,
        taxPerc: item.taxPerc,
        locationCode,
        edit: false,
        tax,
        qtytoShip: item.qtytoShip,
        OutstandingQuantity: item.OutstandingQuantity
      })
    );
    // this.unitMeasureList[arr.length - 1] = item.unitOfMeasures;
    this.measureList(item.unitOfMeasures, item.priceListC, (arr.length - 1));
    // this.listPrices[arr.length - 1] = item.priceListC;
    return arr;  
  }

  /**
   * Add measures with price.
   * @param unitOfMeasures 
   * @param priceListC 
   * @param i 
   */
  measureList(unitOfMeasures: any, priceListC: any, i: number) {
    this.unitMeasureList[i] = [];
    // for(let y in unitOfMeasures) {
    //   let x = priceListC.filter(x => {
    //     return (x.UnitofMeasureCode === unitOfMeasures[y].id);
    //   })
    //   if (x.length > 0) this.unitMeasureList[i].push(unitOfMeasures[y]);
    // }
    this.unitMeasureList[i] = unitOfMeasures;
    this.listPrices[i] = priceListC;
  }

  /**
   * sales order lines
   * @param lines 
   * @returns 
   */
  async setSalesOrderLines(lines) {
    let edit = false;
    let arr = new UntypedFormArray([]);
    for(let i in lines) {
      let item = await this.items.find(x => (x.id === lines[i].id));
      await this.addItem(item, false);
      let lineDiscountPercentage = lines[i].fields['LineDiscount%'] === null ? 0 : lines[i].fields['LineDiscount%'];
      let taxPerc = (item.taxPerc === null) ? 0 : item.taxPerc;
      let tax =  lines[i].fields.Amount * ( taxPerc / 100);
      let unitPrice = lines[i].fields.UnitPrice === null ? 0 : lines[i].fields.UnitPrice;
      let total = lines[i].fields.Amount === null ? 0 : lines[i].fields.Amount;
      let lineDiscountAmount = lines[i].fields.LineDiscountAmount === null ? 0 : lines[i].fields.LineDiscountAmount;
      let totalWithoutDiscount = total + lineDiscountAmount;
      edit = !(unitPrice === item.unitPrice);
      if (!edit) {
        edit = !(lineDiscountPercentage === item.discountPerc);
      }
      arr.push(
        this.formBuilder.group({
          title: lines[i].value,
          id: lines[i].id,
          type: item.fields.Type,
          categoryNo: '',
          quantity: lines[i].fields.Quantity,
          unitPrice,
          total,
          totalWithoutDiscount,
          picture: (item !== undefined) ? `data:image/jpeg;base64,${item.fields.Picture}` : 'data:image/jpeg;base64,NOIMAGE',
          unitOfMeasureCode: lines[i].fields.UnitofMeasureCode,
          lineDiscountAmount,
          lineDiscountPercentage,
          taxPerc: taxPerc,
          locationCode: lines[i].fields.LocationCode === null  ? '' : lines[i].fields.LocationCode,
          edit,
          tax,
          qtytoShip: lines[i].fields.QtytoShip == null?0:lines[i].fields.QtytoShip,
          OutstandingQuantity: lines[i].fields.OutstandingQuantity,
          LineNo: lines[i].LineNo

        })
      );
      this.unitMeasureList[arr.length - 1] = item.unitOfMeasures;
      this.listPrices[arr.length - 1] = item.priceListC;
    }
    return arr;
  }

  /**
   * temp sales lines
   * @param lines 
   * @returns 
   */
   async setTempSalesLines(lines) {
    let arr = new UntypedFormArray([]);
    for(let i in lines) {
      let item = await this.items.find(x => (x.id === lines[i].id));
      await this.addItem(item, false);
      arr.push(
        this.formBuilder.group({
          title: item.value,
          id: lines[i].id,
          type: lines[i].type,
          categoryNo: '',
          quantity: lines[i].quantity,
          unitPrice: lines[i].unitPrice,
          total: lines[i].total,
          totalWithoutDiscount: lines[i].totalWithoutDiscount,
          picture: (item !== undefined) ? `data:image/jpeg;base64,${item.fields.Picture}` : 'data:image/jpeg;base64,NOIMAGE',
          unitOfMeasureCode: lines[i].unitOfMeasureCode,
          lineDiscountAmount: lines[i].lineDiscountAmount,
          lineDiscountPercentage: lines[i].lineDiscountPercentage,
          taxPerc: lines[i].taxPerc,
          locationCode: lines[i].locationCode,
          edit: lines[i].edit,
          tax: lines[i].tax,
          qtytoShip: lines[i].qtytoShip,
          OutstandingQuantity: lines[i].fields.OutstandingQuantity,
        })
      );
      this.unitMeasureList[arr.length - 1] = item.unitOfMeasures;
      this.listPrices[arr.length - 1] = item.priceListC;
    }
    return arr;
  }
  pickingAll(){

    let items = this.frm.get('lines')['controls'];
    console.log(items);

  this.barcodeScanner.scan().then(
    barCodeData => {
    let code = barCodeData.text;
    if(code ! = ''){

      let item = items.find(x => x.value.id === code.toUpperCase());
      let index = items.indexOf(items.find(x => x.value.id === code.toUpperCase()));
     
      if(item != undefined){
        this.popoverPicking(index,item);
      }else{
        this.intServ.alertFunc(this.js.getAlert('alert', '', `The item ${code.toUpperCase()} is not in the list, please scan it.`));
      }

    } 
   
  
      }
    ).catch(
      err => {
        console.log(err);
      }
    )
  
  }

  scanItem(){

    
    this.barcodeScanner.scan().then(
      barCodeData => {
        let code = barCodeData.text;
        this.setLines;
      }
    ).catch(
      err => {
        console.log(err);
      });

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

  async setCustomer() {
    this.frm.controls['customerNo'].setValue(this.customer.id);
    this.frm.controls['customerName'].setValue(this.customer.value);
    // if (this.customer.shipAddress.length < 1) {
    //   this.intServ.alertFunc(this.js.getAlert('alert', 'alert', `This customer does not have ship-to Address`));
    //   this.clearShipAdress();
    // }
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
          this.frm.addControl(x.id,new UntypedFormControl(x.value,Validators.required));
        } else {
          this.frm.addControl(x.id,new UntypedFormControl(x.value));
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


  private async getItemsList() {
    console.log(this.items);
    let obj = this.general.structSearch(this.items, 'Search item', 'Items', async (item) => {
      await this.addItem(item);
      if (item.error)
        this.intServ.alertFunc(this.js.getAlert('alert', 'Alert', 'The tax posting setup does not exist.'));
    }, false);
    this.intServ.searchShowFunc(obj);
  }

  async getBC() {
    // await this.getCategories();
    await this.getCustomers();  
    await this.getItems();
    await this.getTaxPostings();
    await this.getLocations();
    await this.getInventorySetup();
  }

  private async validMandatory():  Promise<boolean> {
    let returnValue: boolean = true;
    if (this.locationMandatory) {
      let lines = this.frm.controls.lines.value;
      for (let i in lines) {
        if (lines[i].type === 'Inventory') {
          if (lines[i].locationCode === '' || lines[i].locationCode === null) {
            returnValue = false;
          }
        }
      }
    }
    return returnValue;
  }

  private async getCustomers() {
    let process = await this.syncerp.processRequest('GetCustomers', "0", "", this.module.erpUserId);
    let customers = await this.syncerp.setRequest(process);
    this.customers = await this.general.customerList(customers.Customers);
  }

  // Disabled
  // Get items
  private async getItems() {
    let process = await this.syncerp.processRequestParams('GetItems', [{ pageSize: 2000 }]);
    let items = await this.syncerp.setRequest(process);
    this.items = await this.general.item(items.Items);
  }

  /**
   * get items by category
   */
  private async getCategories() {
    let process = await this.syncerp.processRequest('GetItemCategories', "0", "", this.module.erpUserId);
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
  
  /**
   * get all tax settings
   */
   private async getTaxPostings() {
    let process = await this.syncerp.processRequestParams('GetTaxPostings', []);
    let {VATPostingSetup} = await this.syncerp.setRequest(process);
    this.vatPostingSetup = VATPostingSetup;
  }

  /**
   * get all locations
   */
  private async getLocations() {
    let process = await this.syncerp.processRequestParams('GetLocations', []);
    let {LocationSetup} = await this.syncerp.setRequest(process);
    this.locationSetup = LocationSetup === undefined ? [] : LocationSetup;
  }

  /**
   * get all locations
   */
   private async getInventorySetup() {
    let process = await this.syncerp.processRequestParams('GetInventorySetup', []);
    let {InventorySetup} = await this.syncerp.setRequest(process);
    this.locationMandatory = InventorySetup.LocationMandatory;
  }

  private async getConstructor() {
    this.initForm();
    this.module = await this.moduleService.getSelectedModule();
    this.process = await this.moduleService.getSelectedProcess();
    if (this.process.processId === 'P002') {
      this.hideShipTo = true;
    } // P003 - Dont Order Date - Dont delivery
    if ( this.process.processId === 'P003' || this.process.processId === 'P004') {
      this.hideOrderDate = true;
      this.hideShipTo = true;
    }
    this.salesType = this.process.salesType;
    this.permissions = this.process.sysPermits;
    if (this.permissions.indexOf(E_PROCESSTYPE.Edit) !== -1) this.edit = true;
    this.extras = true;
    this.new = this.routExtras.state.new;
    if (this.new) {
      this.customer = this.routExtras.state.customer;
      await this.initNew();
      await this.setCustomer();
    } else {
      this.order = this.routExtras.state.order;

      console.log('order =>',this.order);
      if(this.order.fields.Status === "Released")this.disabled = true; 
      
      this.temp = this.routExtras.state.temp;
      await this.initForm();
    }
  }
}
