import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { InterceptService } from '@svc/intercept.service';
import { JsonService } from '@svc/json.service';
import { WmsService } from '@svc/wms.service';

import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-update-item',
  templateUrl: './update-item.component.html',
  styleUrls: ['./update-item.component.scss'],
})
export class UpdateItemComponent implements OnInit {

  public item: any = {};
  public lp: any = {};
  public lstUoM: any = [];
  public frm: UntypedFormGroup;
  @Input() options: any = {};

  public update = false;


  constructor(private intServ: InterceptService
    , private formBuilder: UntypedFormBuilder
    , private jsonService: JsonService
    , private wmsService: WmsService
    , private popoverController: PopoverController
    , private interceptService: InterceptService,
    private router: Router,
    private storage: Storage

  ) {


    this.frm = this.formBuilder.group(
      {
        TotalToReceive: [' ', Validators.required],

      }
    )
  }
 async ngOnInit() {

    this.item = this.options.item === undefined ? {} : this.options.item;
    this.lp = this.options.lp === undefined ? {} : this.options.lp;
    var lstUnitofMeasure = this.options.lstUoM === undefined ? {} : this.options.lstUoM;
    this.lstUoM = lstUnitofMeasure.UnitOfMeasure === undefined ? {} : lstUnitofMeasure.UnitOfMeasure;


    console.log(this.item);
  }



  async onSubmit() {


    if (this.frm.valid) {


      this.interceptService.loadingFunc(true);

      let obj = await this.jsonService.formToJson(this.frm);


      let list = [
        {
          WarehouseReceiptLines: [
            {
              No: this.item.No,
              SourceNo: this.item.SourceNo,
              ItemNo: this.item.ItemNo,
              LineNo: this.item.LineNo,
              ZoneCode: this.item.ZoneCode,
              LocationCode: this.item.LocationCode,
              BinCode: this.item.BinCode,
              QtyToReceive: obj.TotalToReceive
            },
          ]
        }
      ]

      console.log(list);

      try {

        let res = await this.wmsService.Update_WsheReceiveLine(list);

        console.log(res);

        if (res.Error || res.error) throw new Error((res.Error) ? res.Error.Message : res.error.message);

        if (res.message) throw new Error(res.message);


        this.intServ.loadingFunc(false);
        this.update = true;
        this.storage.set(`update item ${this.item.No}`, this.update);

        this.intServ.alertFunc(this.jsonService.getAlert('success', 'The item quantities have been successfully posted.', '', ()=> {this.popoverController.dismiss({receive: obj.TotalToReceive})}));


      } catch (error) {
        this.intServ.loadingFunc(false);

        this.intServ.alertFunc(this.jsonService.getAlert('error', '', error.message));

      }
    }

  }


  public async closePopover() {
    this.popoverController.dismiss({});
  }
}
