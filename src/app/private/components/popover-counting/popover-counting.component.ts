import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PopoverController } from '@ionic/angular';
import { InterceptService } from '@svc/intercept.service';
import { JsonService } from '@svc/json.service';
import { WmsService } from '@svc/wms.service';

@Component({
  selector: 'app-popover-counting',
  templateUrl: './popover-counting.component.html',
  styleUrls: ['./popover-counting.component.scss'],
})
export class PopoverCountingComponent implements OnInit {

  @Input() list:any;
  public item:any;
  public frm: FormGroup;
  constructor(private intServ: InterceptService
    , private formBuilder: FormBuilder
    , private jsonService: JsonService
    , private wmsService: WmsService
    , private popoverController: PopoverController) { 
      this.frm = this.formBuilder.group(
        {
          qty: ['', Validators.required],
         
        }
      )
    }

  ngOnInit() {
   this.item = (this.list.length === 1)? this.list[0]:undefined;
   console.log(this.item);
  }

  
  public async closePopover() {
    this.popoverController.dismiss({qty:undefined});
  }

  public async onSubmit(){

    if(this.frm.valid){

      let obj = await this.jsonService.formToJson(this.frm);
      this.popoverController.dismiss({qty:obj.qty, obj: this.list});
    }
  

  }
}
