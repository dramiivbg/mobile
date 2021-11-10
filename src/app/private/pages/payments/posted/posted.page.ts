import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Module } from '@mdl/module';
import { IPosted } from '@mdl/posted';
import { GeneralService } from '@svc/general.service';
import { ModuleService } from '@svc/gui/module.service';
import { InterceptService } from '@svc/intercept.service';
import { JsonService } from '@svc/json.service';
import { SalesService } from '@svc/Sales.service';
import { UserService } from '@svc/user.service';
import * as moment from 'moment';

@Component({
  selector: 'app-posted',
  templateUrl: './posted.page.html',
  styleUrls: ['./posted.page.scss'],
})
export class PostedPage implements OnInit  {
  public module: Module;
  public customer: any;
  public posted: Array<IPosted> = [];
  public filterPosted: Array<IPosted> = [];

  constructor(private salesService: SalesService
    , private intServ: InterceptService
    , private router: Router
    , private moduleService: ModuleService
    , private generalService: GeneralService
    , private userService: UserService
    , private js: JsonService
  ) { 
    let objFunc = {
      func: () => {
        this.onBack();
      }
    };
    this.intServ.appBackFunc(objFunc);
    /** get all */
    this.intServ.stripePay$.subscribe(
      async (req: any) => {
        if (req.reload !== undefined) {
          this.intServ.loadingFunc(true);
          await this.get(); 
          this.intServ.loadingFunc(false);
        }
      }
    )
  }

  public async ngOnInit() {}

  public async ionViewWillEnter() {
    this.intServ.loadingFunc(true);
    this.customer = await this.userService.getCustomer();
    this.module = await this.moduleService.getSelectedModule();
    await this.get(); 
    this.intServ.loadingFunc(false);
  }

  /**
   * get methods
   */
  public async get() {
    await this.getPosted();
  }

  /**
   * Search with BilltoName or No
   * @param e 
   */
  public onChange(e) {
    let val = e.target.value;
    if (val === '') {
      this.filterPosted = this.posted;
    } else {
      this.filterPosted = this.posted.filter(
        x => {
          return (x.fields.No.toLowerCase().includes(val.toLowerCase()) || (x.fields.BilltoName.toLowerCase().includes(val.toLowerCase())));
        }
      )
    } 
  }
  
  /**
   * Paid with stripe
   * @param item 
   */
  public async onPaid(item: IPosted) {
    let paidBC: any = {
      customerNo: item.fields.BilltoCustomerNo,
      postedDocNo: item.fields.No,
      amount: Number((item.fields.AmountIncludingVAT - item.OriginalPmtDiscPossible).toFixed(2)),
      transactionNo: '',
      postingDate: item.fields.PostingDate,
      documentDate: moment().format('yyyy-MM-DD')
    }
    let obj: any = {
      Name: item.fields.BilltoName,
      CustomerId: this.customer.customerId,
      DocumentNum: item.fields.No,
      Currency: 'usd',
      Subtotal: item.fields.Amount,
      Tax: Number(item.fields.AmountIncludingVAT - item.fields.Amount).toFixed(2),
      Amount: Number((item.fields.AmountIncludingVAT - item.OriginalPmtDiscPossible).toFixed(2)),
      Discount: item.OriginalPmtDiscPossible,
      paidBC
    }
    try {
      this.intServ.stripePayFunc(obj);
    } catch ({error}) {
      this.intServ.alertFunc(this.js.getAlert('error', 'Error', error.message));
    }
  }

  /**
   * get posted sales invoices
   */
  private async getPosted() {
    let obj: any = {
      paid: true,
      salesPerson: this.module.erpUserId
    }
    let posted = await this.salesService.getPostedSalesInvoices(obj);
    this.posted = await this.generalService.PostedList(posted.SalesOrders);
    if (this.posted.length > 0) {
      for (let i in this.posted) {
        this.posted[i].fields.Total = Number((this.posted[i].fields.AmountIncludingVAT - this.posted[i].OriginalPmtDiscPossible).toFixed(2));
      }
    }
    this.filterPosted = this.posted;
  }

  /**
  * Return to the modules.
  */
  private onBack() {
    this.router.navigate(['page/payments/paymentMain'], { replaceUrl: true });
  }

}
