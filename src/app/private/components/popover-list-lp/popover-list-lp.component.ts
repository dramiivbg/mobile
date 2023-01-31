import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { PopoverController } from '@ionic/angular';
import { popoverController } from '@ionic/core';
import { InterceptService } from '@svc/intercept.service';
import { JsonService } from '@svc/json.service';
import { WmsService } from '@svc/wms.service';

@Component({
  selector: 'app-popover-list-lp',
  templateUrl: './popover-list-lp.component.html',
  styleUrls: ['./popover-list-lp.component.scss'],
})
export class PopoverListLpComponent implements OnInit {
  public frm: FormGroup;
  @Input() lp:any;
  public listBin:any;
  constructor(private formBuilder: FormBuilder,private barcodeScanner: BarcodeScanner, 
    private popoverController: PopoverController,private intServ: InterceptService
    , private js: JsonService,private wmsService: WmsService) { }

  ngOnInit() {
    console.log(this.lp);
    this.frm = this.formBuilder.group(
      {
        qty: ['', Validators.required],
       
      }
    )
  }

  close(){
    this.popoverController.dismiss({});
  }

  BinToBin(){

    this.popoverController.dismiss({lp:this.lp,action:'BintoBin'});

  }

  Count(){



  }

}
