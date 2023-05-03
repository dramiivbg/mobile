import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { PopoverController } from '@ionic/angular';
import { popoverController } from '@ionic/core';
import { InterceptService } from '@svc/intercept.service';
import { JsonService } from '@svc/json.service';
import { WmsService } from '@svc/wms.service';
import { PopoverCountingComponent } from '../popover-counting/popover-counting.component';

@Component({
  selector: 'app-popover-list-lp',
  templateUrl: './popover-list-lp.component.html',
  styleUrls: ['./popover-list-lp.component.scss'],
})
export class PopoverListLpComponent implements OnInit {
  public frm: UntypedFormGroup;
  @Input() lp:any;
  @Input() active:boolean = true;
  public listBin:any;
  public size = '';
  constructor(private formBuilder: UntypedFormBuilder,private barcodeScanner: BarcodeScanner, 
    private popoverController: PopoverController,private intServ: InterceptService
    , private js: JsonService,private wmsService: WmsService) { }

  ngOnInit() {

    this.size = this.active?"6":"12";

  }

  close(){
    this.popoverController.dismiss({});
  }

  BinToBin(){

    this.popoverController.dismiss({lp:this.lp,action:'BintoBin'});

  }

async  Count(){

        const popover = await this.popoverController.create({
          component: PopoverCountingComponent,
          cssClass: 'popoverCountingComponent',
          componentProps: {list:this.lp},
          backdropDismiss: false
          
        });
        await popover.present();
        const { data } = await popover.onDidDismiss();
    
    }

}
