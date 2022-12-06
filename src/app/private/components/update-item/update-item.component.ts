import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { InterceptService } from '@svc/intercept.service';
import { JsonService } from '@svc/json.service';
import { WmsService } from '@svc/wms.service';

@Component({
  selector: 'app-update-item',
  templateUrl: './update-item.component.html',
  styleUrls: ['./update-item.component.scss'],
})
export class UpdateItemComponent implements OnInit {

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
    , private interceptService: InterceptService,
    private router: Router

  ) {


    this.frm = this.formBuilder.group(
      {
        TotalToReceive: ['0', Validators.required],
       
      }
    )
  }
  ngOnInit() {

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


      let list =  [
        {
          WarehouseReceiptLines: [
            {
              No: this.item.No,
              SourceNo:this.item.SourceNo,
              ItemNo: this.item.ItemNo,
              LineNo: this.item.LineNo,
              ZoneCode: this.item.ZoneCode,
              LocationCode: this.item.LocationCode,
              BinCode: this.item.BinCode,
              QtyToReceive: this.item.Quantity/obj.TotalToReceive
            },
            {
              No: this.item.No,
              SourceNo:this.item.SourceNo,
              ItemNo: this.item.ItemNo,
              LineNo: this.item.LineNo,
              ZoneCode: this.item.ZoneCode,
              LocationCode: this.item.LocationCode,
              BinCode: this.item.BinCode,
              QtyToReceive: obj.TotalToReceive
            }
          ]
        }
      ]

      console.log(list);

      try {
        
        let res = await this.wmsService.Update_WsheReceiveLine(list);

        console.log(res);

        if(res.Error) throw new Error(res.Error.Message);

        this.intServ.loadingFunc(false);

        this.intServ.alertFunc(this.jsonService.getAlert('success', '', ''));
        
      } catch (error) {
        this.intServ.loadingFunc(false);

        this.intServ.alertFunc(this.jsonService.getAlert('success', '', error.message));

      }
    }

  }


  public async closePopover() {
    this.popoverController.dismiss({});
  }
}
