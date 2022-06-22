import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Process } from '@mdl/module';
import { GeneralService } from '@svc/general.service';
import { ModuleService } from '@svc/gui/module.service';
import { InterceptService } from '@svc/intercept.service';
import { JsonService } from '@svc/json.service';
import { SyncerpService } from '@svc/syncerp.service';

@Component({
  selector: 'app-wms-main',
  templateUrl: './wms-main.page.html',
  styleUrls: ['./wms-main.page.scss'],
})
export class WmsMainPage implements OnInit {
  public module: any = {};
  public sessionLogin: any = {};
  public session: any = {};


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

  public ngOnInit() {
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

  /**
  * Return to the modules.
  */
  public onBack() {
    this.router.navigate(['page/main/modules'], { replaceUrl: true });
  }

  public async onWMS(process: Process) {
    this.intServ.loadingFunc(true);
    const method = await this.method(process);
    process.salesType = await this.general.typeSalesBC(process);
    process.sysPermits = await this.general.getPermissions(process.permissions);
    await this.moduleService.setSelectedProcess(process);
    if (process.processId === 'P007') {
      let p = await this.syncerp.processRequestParams(method, [{ assigned_user_id: this.module.erpUserId }]);
      let rsl = await this.syncerp.setRequest(p);
      let wareReceipts = rsl.WarehouseReceipts;
      await this.mappingWareReceipts(wareReceipts, process);
    }
    this.intServ.loadingFunc(false);
  }

  private async mappingWareReceipts(wareReceipts: any, process: Process) {
    let receipts = await this.general.ReceiptsList(wareReceipts);
    if (receipts.length > 0) {
      console.log(process);
      let obj = this.general.structSearch(receipts, `Search ${process.description}`, 'Receipts', async (wms) => {
        let navigationExtras: NavigationExtras = {
          state: {
            wms: wms,
            new: false
          },
          replaceUrl: true
        };
        this.router.navigate(['page/wms/wmsReceipt'], navigationExtras);
        setTimeout(
          () => {
            this.intServ.searchShowFunc({});
          }, 1000
        )
      }, false, 0, process);
      this.intServ.searchShowFunc(obj);
    } else {
      this.intServ.alertFunc(this.js.getAlert('alert', 'Alert', `No ${process.salesType} were found.`));
    }
  }

  private async method(process: Process) : Promise<string> {
    switch(process.processId) {
      case "P007":
        return 'GetWarehouseReceipts';
      case "P008":
        return 'GetWarehousePutAways';
    }
  }

}
