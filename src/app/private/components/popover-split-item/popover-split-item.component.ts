import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { InterceptService } from '@svc/intercept.service';
import { JsonService } from '@svc/json.service';
import { WmsService } from '@svc/wms.service';

@Component({
  selector: 'app-popover-split-item',
  templateUrl: './popover-split-item.component.html',
  styleUrls: ['./popover-split-item.component.scss'],
})
export class PopoverSplitItemComponent implements OnInit {

  @Input() item:any;
  public frm: FormGroup;




  
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
        Qty: ['0', Validators.required],
       
      }
    )
  }

  ngOnInit() {
    console.log(this.item);
  }

  async onSubmit(){

    
    if (this.frm.valid) {

      let obj = await this.jsonService.formToJson(this.frm);

      this.popoverController.dismiss({qty: obj.Qty, item:this.item});
    }
  }

}
