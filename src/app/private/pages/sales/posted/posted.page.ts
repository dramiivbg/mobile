import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GeneralService } from '@svc/general.service';
import { ModuleService } from '@svc/gui/module.service';
import { InterceptService } from '@svc/intercept.service';
import { SalesService } from '@svc/Sales.service';

@Component({
  selector: 'app-posted',
  templateUrl: './posted.page.html',
  styleUrls: ['./posted.page.scss'],
})
export class PostedPage implements OnInit  {
  public module: any;

  constructor(private salesService: SalesService
    , private intServ: InterceptService
    , private router: Router
    , private moduleService: ModuleService
    , private generalService: GeneralService
  ) { 
    let objFunc = {
      func: () => {
        this.onBack();
      }
    };
    this.intServ.appBackFunc(objFunc);
  }

  public async ngOnInit() {}

  async ionViewWillEnter() {
    this.intServ.loadingFunc(true);
    this.module = await this.moduleService.getSelectedModule();
    await this.get();
    this.intServ.loadingFunc(false);
  }

  public async get() {
    await this.getPosted();
  }

  private async getPosted() {
    let obj: any = {
      paid: true,
      salesPerson: this.module.erpUserId
    }
    let posted = await this.salesService.getPostedSalesInvoices(obj);
    let p = await this.generalService.PostedList(posted.SalesOrders);
    console.log(p);
  }

  /**
  * Return to the modules.
  */
  private onBack() {
    this.router.navigate(['page/main/modules'], { replaceUrl: true });
  }

}
