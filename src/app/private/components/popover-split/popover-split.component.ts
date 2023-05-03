import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { PopoverController } from '@ionic/angular';
import { InterceptService } from '@svc/intercept.service';
import { JsonService } from '@svc/json.service';
import { WmsService } from '@svc/wms.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-popover-split',
  templateUrl: './popover-split.component.html',
  styleUrls: ['./popover-split.component.scss'],
})
export class PopoverSplitComponent implements OnInit {
  public frm: UntypedFormGroup;

  @Input() lp:any;
  @Input() listSingleVoid:any;
  public No = '';

  constructor(private formBuilder: UntypedFormBuilder, 
    private jsonService: JsonService
    , private popoverController: PopoverController
 ) { 


    this.frm = this.formBuilder.group(
      {
        Quantity: [0, Validators.required],
       
      
      }
    )
  }

  ngOnInit() {

    console.log(this.lp);
  }


  public async closePopover() {
    this.popoverController.dismiss({});
  }



 async onSubmit(){


    if (this.frm.valid) {


      let obj = await this.jsonService.formToJson(this.frm);
     
     
     if(obj.Quantity <= this.lp.fields.PLUQuantity){

      if(obj.Quantity > 0){

 
        this.popoverController.dismiss({qty: obj.Quantity, lpNo: this.No});

      }

  
     }

    }

 }


 onSelect(p){

  this.No = p;

  console.log(this.No);
}


}
