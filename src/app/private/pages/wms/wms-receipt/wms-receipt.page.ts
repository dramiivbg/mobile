import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ModalController, PopoverController } from '@ionic/angular';
import { Process } from '@mdl/module';
import { PopoverOptionsComponent } from '@prv/components/popover-options/popover-options.component';
import { GeneralService } from '@svc/general.service';
import { ModuleService } from '@svc/gui/module.service';
import { InterceptService } from '@svc/intercept.service';
import { JsonService } from '@svc/json.service';
import { SyncerpService } from '@svc/syncerp.service';
import { WmsService } from '@svc/wms.service';
import { LicensePlatesComponent } from '../license-plates/license-plates.component';

@Component({
  selector: 'app-wms-receipt',
  templateUrl: './wms-receipt.page.html',
  styleUrls: ['./wms-receipt.page.scss'],
  providers: [
    PopoverController
  ]
})
export class WmsReceiptPage implements OnInit {
  public wareReceipts: any = {};
  public btnExample: boolean = false;
  private module: any = {};
  private process: Process;
  private routExtras: any;

  constructor(private wmsService: WmsService
    , private intServ: InterceptService
    , private js: JsonService
    , private route: ActivatedRoute
    , private router: Router
    , private moduleService: ModuleService
    , private general: GeneralService
    , private barcodeScanner: BarcodeScanner
    , public popoverController: PopoverController
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
        this.getReceipt();
      } else {
        this.router.navigate(['page/wms/wmsMain'], { replaceUrl: true });
      }
    });
  }

  public async ngOnInit() {
  }

  public async ionViewWillEnter() {
    try {
      this.module = await this.moduleService.getSelectedModule();
      this.process = await this.moduleService.getSelectedProcess();
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

  /**
   * bar camera
   */
  public onBarCode() {
    this.barcodeScanner.scan().then(
      barCodeData => {
        let code = barCodeData.text;
        let line = this.wareReceipts.lines.find(x => x.ItemNo === code);
        if (line === null || line === undefined) {
          this.intServ.alertFunc(this.js.getAlert('error', 'Error', `The item '${code}' does not exist on this receipt`));
        } else {
          console.log(line);
        }
      }
    ).catch(
      err => {
        console.log(err);
      }
    )
  }

  public async onPopoverMenu(ev: any, item: any) {
    const popover = await this.popoverController.create({
      component: PopoverOptionsComponent,
      cssClass: 'popoverOptions',
      event: ev,
      translucent: true,
      componentProps: this.listMenu(item)
    });
    await popover.present();
  
    const { data } = await popover.onDidDismiss();
    if (data.data.No !== undefined) {
      this.onPopLicensePlates(ev, item);
    }
  }

  public async onPopLicensePlates(ev: any, item: any) {
    this.intServ.loadingFunc(true);
    let lp = await this.wmsService.getPendingToReceiveLP(item.No, item.ItemNo, item.UnitofMeasureCode, item.BinCode);
    let lstUoM = await this.wmsService.getUnitOfMeasure();
    const popover = await this.popoverController.create({
      component: LicensePlatesComponent,
      cssClass: 'popLicensePlate',
      event: ev,
      translucent: true,
      componentProps: { options: { item, lp, lstUoM } },
      backdropDismiss: false
    });
    this.intServ.loadingFunc(false);
    await popover.present();  
    const { data } = await popover.onDidDismiss();
    console.log(data);
  }

  private async getReceipt() {
    this.intServ.loadingFunc(true);
    let wms = this.routExtras.state.wms;
    let receipt = await this.wmsService.getReceiptByNo(wms.id);
    if (receipt.Error !== undefined) {
      this.intServ.alertFunc(this.js.getAlert('error', 'Error', receipt.Error.Message));
    } else {
      this.mappingReceipt(receipt);
    }
    this.intServ.loadingFunc(false);
  }

  /**
   * Mapping Receipts
   * @param receipt { WarehouseReceipt: {WarehouseReceiptHeader, WarehouseReceiptLines} }
   */
  private async mappingReceipt(receipt: any) {
    this.wareReceipts = await this.general.ReceiptHeaderAndLines(receipt.WarehouseReceipt);
    console.log(this.wareReceipts);

  }

  private listMenu(item: any): any {
    return {
      options: {
        name: `PO No. ${item.SourceNo}`,
        menu: [
          { 
            id: 1, 
            name: 'Add/Edit', 
            icon: 'newspaper-outline',
            obj: item
          },
          { 
            id: 2, 
            name: 'Close', 
            icon: 'close-circle-outline' ,
            obj: {}
          }
        ]
      }
    };
  }
}
