import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PopoverController } from '@ionic/angular';
import { InterceptService } from '@svc/intercept.service';
import { JsonService } from '@svc/json.service';
import { WmsService } from '@svc/wms.service';

@Component({
  selector: 'app-license-plates',
  templateUrl: './license-plates.component.html',
  styleUrls: ['./license-plates.component.scss'],
})
export class LicensePlatesComponent implements OnInit {
  public item: any = {};
  public lp: any = {};
  public lstUoM: any = [];
  public frm: FormGroup;
  @Input() options: any = {};

  constructor(private intServ: InterceptService
    , private formBuilder: FormBuilder
    , private jsonService: JsonService
    , private wmsService: WmsService
    , private popoverController: PopoverController
  ) { 
    this.frm = this.formBuilder.group(
      {
        TotalToReceive: ['0', Validators.required],
        NoofPackLP: ['0', Validators.required],
        PackUnitUoM: ['', Validators.required],
      }
    )
  }

  public ngOnInit() {
    this.item = this.options.item === undefined ? {} : this.options.item;
    this.lp = this.options.lp === undefined ? {} : this.options.lp;
    var lstUnitofMeasure = this.options.lstUoM === undefined ? {} : this.options.lstUoM;
    this.lstUoM = lstUnitofMeasure.UnitOfMeasure === undefined ? {} : lstUnitofMeasure.UnitOfMeasure;

    console.log(this.lstUoM);
  }

  public async onSubmit() {
    if (this.frm.valid) {
      let obj = await this.jsonService.formToJson(this.frm);
      obj['No'] = this.item.No;
      obj['ItemNo'] = this.item.ItemNo;
      obj['BinCode'] = this.item.BinCode;
      obj['UnitofMeasureCode'] = this.item.UnitofMeasureCode;
      let rsl = this.wmsService.CreateLPFromWarehouseReceiptLine([obj]);
      this.popoverController.dismiss({});
    }
  }

  public async closePopover() {
    this.popoverController.dismiss({});
  }

}
