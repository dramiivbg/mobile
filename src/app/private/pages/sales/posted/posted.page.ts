import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Module } from '@mdl/module';
import { IPosted } from '@mdl/posted';
import { GeneralService } from '@svc/general.service';
import { ModuleService } from '@svc/gui/module.service';
import { InterceptService } from '@svc/intercept.service';
import { SalesService } from '@svc/Sales.service';
import { UserService } from '@svc/user.service';

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
  ) { 
    let objFunc = {
      func: () => {
        this.onBack();
      }
    };
    this.intServ.appBackFunc(objFunc);
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

  public async get() {
    await this.getPosted();
  }

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

  public async onPaid(item: IPosted) {
    let paidBC: any = {
      customerNo: item.fields.BilltoCustomerNo,
      postedDocNo: item.fields.No,
      amount: item.fields.Amount,
      transactionNo: '',
    }
    let obj: any = {
      Name: item.fields.BilltoName,
      CustomerId: this.customer.customerId,
      DocumentNum: item.fields.No,
      Currency: 'usd',
      Subtotal: item.fields.Amount,
      Tax: 0,
      Amount: item.fields.Amount,
      paidBC
    }
    try {
      this.intServ.stripePayFunc(obj);
    } catch (error) {
      console.log(error);
    }
  }

  private async getPosted() {
    let obj: any = {
      paid: true,
      salesPerson: this.module.erpUserId
    }
    let posted = await this.salesService.getPostedSalesInvoices(obj);
    this.filterPosted = this.posted = await this.generalService.PostedList(posted.SalesOrders);
  }

  /**
  * Return to the modules.
  */
  private onBack() {
    this.router.navigate(['page/main/modules'], { replaceUrl: true });
  }

}
