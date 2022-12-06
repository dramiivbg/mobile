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
        NoofPackLP: ['0', Validators.required],
        PackUnitUoM: ['', Validators.required],
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

    }

  }

  public async closePopover() {

    this.popoverController.dismiss({});

  }

}
