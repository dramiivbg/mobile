import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PopoverController } from '@ionic/angular';
import { InterceptService } from '@svc/intercept.service';
import { JsonService } from '@svc/json.service';
import { WmsService } from '@svc/wms.service';

@Component({
  selector: 'app-popover-split',
  templateUrl: './popover-split.component.html',
  styleUrls: ['./popover-split.component.scss'],
})
export class PopoverSplitComponent implements OnInit {
  public frm: FormGroup;

  constructor(private formBuilder: FormBuilder, 
    private jsonService: JsonService
    , private wmsService: WmsService
    , private popoverController: PopoverController
    , private interceptService: InterceptService) { 


    this.frm = this.formBuilder.group(
      {
        Quantity: ['0', Validators.required],
        PackUnit: ['0', Validators.required],
      
      }
    )
  }

  ngOnInit() {}


  public async closePopover() {
    this.popoverController.dismiss({});
  }



 async onSubmit(){


    if (this.frm.valid) {



      let obj = await this.jsonService.formToJson(this.frm);



      console.log(obj);

    }


  }


}
