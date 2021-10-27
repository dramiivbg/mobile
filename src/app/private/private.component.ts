import { Component, OnInit } from '@angular/core';
import { Network } from '@capacitor/network';
import { ToastController } from '@ionic/angular';
import { InterceptService } from '@svc/intercept.service';
import { NotifyService } from '@svc/notify.service';
import { OfflineService } from '@svc/offline.service';
import { SalesService } from '@svc/Sales.service';
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
  ) { 
    this.asyncNetwork();
  }

  public async ngOnInit() {
    this.presentToast();
  }

  async presentToast() {
    
  }

  /**
   * Message with the device have connection to internet or don't.
   */
  private asyncNetwork() {
    Network.addListener('networkStatusChange', async status => {
      let msg: string = status.connected ? 'You have access to the Internet' : 'You do not have internet access';
      await this.messageToast(msg);
      setTimeout(() => {
        this.sendAllTemps();
      }, 5000);
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

  private async messageToast(msg: string, duration: number = 5000): Promise<void> {
    const toast = await this.toastController.create({
      message: msg,
      duration
    });
    toast.present();
  }

}
