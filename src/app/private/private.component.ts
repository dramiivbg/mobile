import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Network } from '@capacitor/network';
import { ToastController } from '@ionic/angular';
import { InterceptService } from '@svc/intercept.service';
import { NotifyService } from '@svc/notify.service';
import { OfflineService } from '@svc/offline.service';
import { SalesService } from '@svc/Sales.service';
import { JsonService } from '@svc/json.service';
import { E_NOTIFYTYPE } from '@var/enums';

@Component({
  selector: 'app-private',
  templateUrl: './private.component.html'
})
export class PrivateComponent implements OnInit {

  constructor(public toastController: ToastController
    , private offline: OfflineService
    , private salesService: SalesService
    , private intServ: InterceptService
    , private notifyService: NotifyService
    , private js: JsonService
    , private router: Router
  ) { 
    this.asyncNetwork();
  }

  public async ngOnInit() {}

  /**
   * Message with the device have connection to internet or don't.
   */
  private asyncNetwork(): void {
    let setTime: any;
    Network.addListener('networkStatusChange', async status => {
      let msg: string = status.connected ? 'You have access to the Internet' : 'You do not have internet access';
      await this.messageToast(msg);
      if (!status.connected) {
        this.getOutPayments();
      } else {
        clearTimeout(setTime);
        setTime = setTimeout(() => {
          this.sendAllTemps();
        }, 5000);
      }
    });
  }

  private async sendAllTemps() {
    try {
      let temporaly = await this.offline.getProcess('ProcessSalesOrders');
      if (temporaly != null) {
        let bool = await this.salesService.sendAllSalesTemp(temporaly);
        if (bool) {
          this.intServ.updateSalesFunc();
          this.notifyService.createNotification(E_NOTIFYTYPE.Notify, 'All temporary ones have been synchronized correctly');
          this.messageToast('All temporary ones have been synchronized correctly');
        }
      }
    } catch (error) {}
  }

  /**
   * get out of payments
   */
  private async getOutPayments() {
    let setTime: any;
    if (this.router.url.indexOf('payment') !== -1) {
      this.intServ.loadingFunc(true);
      this.router.navigate(['page/main/modules'], { replaceUrl: true });
      this.intServ.stripePayFunc({ Close: true });
      clearTimeout(setTime);
      setTime = setTimeout(() => {
        this.intServ.alertFunc(this.js.getAlert('alert', 'Alert', 'This module is not available for the offline version.', 
          () => {
            this.intServ.loadingFunc(false);
          })
        );
      }, 1500);
      setTime = setTimeout(() => {
        this.getOutPayments();
      }, 6000);
    }
  }

  private async messageToast(msg: string, duration: number = 5000): Promise<void> {
    const toast = await this.toastController.create({
      message: msg,
      duration
    });
    toast.present();
  }

}
