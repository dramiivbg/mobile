import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Process } from '@mdl/module';
import { GeneralService } from '@svc/general.service';
import { ModuleService } from '@svc/gui/module.service';
import { InterceptService } from '@svc/intercept.service';
import { JsonService } from '@svc/json.service';
import { SyncerpService } from '@svc/syncerp.service';

@Component({
  selector: 'app-payment-main',
  templateUrl: './payment-main.page.html',
  styleUrls: ['./payment-main.page.scss'],
})
export class PaymentMainPage implements OnInit {
  public sessionLogin: any = {};
  public session: any = {};
  public module: any = {};
  public salesCount: any = {};

  constructor(private syncerp: SyncerpService
    , private general: GeneralService
    , private intServ: InterceptService
    , private js: JsonService
    , private router: Router
    , private moduleService: ModuleService
  ) { 
    let objFunc = {
      func: () => {
        this.onBack();
      }
    };
    this.intServ.appBackFunc(objFunc);
  }

  ngOnInit() {
  }

  public async ionViewWillEnter() {
    try {
      this.intServ.loadingFunc(true);
      this.module = await this.moduleService.getSelectedModule();
      this.session = (await this.js.getSession()).login;
      this.intServ.loadingFunc(false);
    } catch (error) {
      this.intServ.loadingFunc(false);
    }
  }

  public onPosted(process) {
    if (process.processId === 'P005')
      this.router.navigate(['page/payments/posted'], { replaceUrl: true });
    else if (process.processId === 'P006')
      this.router.navigate(['page/payments/paymentMade'], { replaceUrl: true });
    // this.intServ.alertFunc(this.js.getAlert('alert', 'Alert', 'This option is not yet available'));
  }

  /**
  * Return to the modules.
  */
  public onBack() {
    this.router.navigate(['page/main/modules'], { replaceUrl: true });
  }
}
