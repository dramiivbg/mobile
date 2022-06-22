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
import { UserService } from '@svc/user.service';
import { AuthService } from '@svc/auth.service';

@Component({
  selector: 'app-private',
  templateUrl: './private.component.html'
})
export class PrivateComponent implements OnInit {
  private setTimeNetwork: any;
  private setTimePayments: any;
  private setTimePaymentsAgain: any;
  private setTimeModifyUser: any;

  constructor(public toastController: ToastController
    , private offline: OfflineService
    , private salesService: SalesService
    , private intServ: InterceptService
    , private notifyService: NotifyService
    , private js: JsonService
    , private router: Router
    , private userService: UserService
    , private authService: AuthService
  ) { 
    this.asyncNetwork();
    this.isModifiedMobileUser();
  }

  public async ngOnInit() {}

  /**
   * Message with the device have connection to internet or don't.
   */
  private asyncNetwork(): void {
    Network.addListener('networkStatusChange', async status => {
      let msg: string = status.connected ? 'You have access to the Internet' : 'You do not have internet access';
      await this.messageToast(msg);
      if (!status.connected) {
        this.getOutPayments();
      } else {
        clearTimeout(this.setTimeNetwork);
        this.setTimeNetwork = setTimeout(() => {
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
    if (this.router.url.indexOf('payment') !== -1) {
      this.intServ.loadingFunc(true);
      this.router.navigate(['page/main/modules'], { replaceUrl: true });
      this.intServ.stripePayFunc({ Close: true });
      clearTimeout(this.setTimePayments);
      this.setTimePayments = setTimeout(() => {
        this.intServ.alertFunc(this.js.getAlert('alert', 'Alert', 'This module is not available for the offline version.', 
          () => {
            this.intServ.loadingFunc(false);
          })
        );
      }, 1500);
      clearTimeout(this.setTimePaymentsAgain);
      this.setTimePaymentsAgain = setTimeout(() => {
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

  private async isModifiedMobileUser() {
    console.log(1);
    try {
      let rsl = await this.userService.isModifiedMobileUser();
      if (rsl.isModifiedUser) {
        await this.authService.signOutUserModify();
        this.router.navigate(['login'], { replaceUrl: true});
      } else {
        clearTimeout(this.setTimeModifyUser);
        this.setTimeModifyUser = setTimeout(() => {
          this.isModifiedMobileUser();
        }, 30000);
      }
    } catch (error) {
      console.log(error);
    }
  }

}
