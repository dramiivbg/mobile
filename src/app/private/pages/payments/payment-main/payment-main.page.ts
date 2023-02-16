import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Process } from '@mdl/module';
import { GeneralService } from '@svc/general.service';
import { ModuleService } from '@svc/gui/module.service';
import { InterceptService } from '@svc/intercept.service';
import { JsonService } from '@svc/json.service';
import { SyncerpService } from '@svc/syncerp.service';
import { E_PROCESSTYPE } from '@var/enums';

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

   //   console.log('modulos =>',this.module);
      console.log(this.module);
      this.session = (await this.js.getSession()).login;
      this.intServ.loadingFunc(false);
    } catch (error) {
      this.intServ.loadingFunc(false);
    }
  }

  public async  onPosted(process) {

    
    try {
      if (process.processId === 'P005')
        this.router.navigate(['page/payments/posted'], { replaceUrl: true });
      else if (process.processId === 'P006') {
        
        console.log('permisos =>',process.permissions);
        process.sysPermits = await this.general.getPermissions(process.permissions);
       console.log('permisos =>', process.sysPermits);
        if (process.sysPermits.indexOf(E_PROCESSTYPE.ViewPayments) === -1) {
          let error = { message: 'You do not have permission to view payments' }
          throw error;
        }
        this.router.navigate(['page/payments/paymentMade'], { replaceUrl: true });
      }
    } catch (error) {
      this.intServ.alertFunc(this.js.getAlert('error', 'Error', error.message));
    }      
  }

  /**
  * Return to the modules.
  */
  public onBack() {
    this.router.navigate(['page/main/modules'], { replaceUrl: true });
  }
}
