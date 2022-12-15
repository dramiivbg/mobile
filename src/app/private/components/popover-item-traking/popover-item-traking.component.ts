import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-popover-item-traking',
  templateUrl: './popover-item-traking.component.html',
  styleUrls: ['./popover-item-traking.component.scss'],
})
export class PopoverItemTrakingComponent implements OnInit {

  public serial:boolean;
  public lot:boolean;
  public exp:boolean;
  public lp:any;
 @Input() options:any;

 public item:any;

  public frm: FormGroup;
  constructor(private formBuilder: FormBuilder, public popoverController: PopoverController) {
    this.frm = this.formBuilder.group(
      {
        Qty: ['0', Validators.required],
        requestedDeliveryDate: ['', Validators.required],
        TotalToReceive: [0, Validators.required],
        SerialNo: ['', Validators.required],
        LotNo: ['', Validators.required],
        QtyBase: [0, Validators.required],
        QtyHandleBase: [0, Validators.required],



      }
    )
  }

  ngOnInit() {

  //  console.log(this.options);

    this.item = (this.options.item !== null)? this.options.item:null;
    this.lp = (this.options.lp !== null)? this.options.lp:null;

    console.log(this.item,this.lp);

    switch(this.item.trakingCode){
      case "LOTSNSALES":
        this.lot = true;
        this.serial = true;
        this.exp = true;
        break;
      
      case "LOTALL":
        this.lot = true;
        break;

      case "LOTALLEXP":
        this.lot = true;
        this.exp = true;
        break;
        
      case (["SNALL" , "SN-PROD" , "SNSALES"].indexOf(this.item.trakingCode)+1 && this.item.trakingCode):
        this.serial = true;
        break;

    }
    

  }


  async closePopover() {

    this.popoverController.dismiss({});
  }


}
