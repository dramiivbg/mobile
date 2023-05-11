import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { PopoverController } from '@ionic/angular';
import { InterceptService } from '@svc/intercept.service';
import { JsonService } from '@svc/json.service';
import { WmsService } from '@svc/wms.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-split-item',
  templateUrl: './split-item.component.html',
  styleUrls: ['./split-item.component.scss'],
})
export class SplitItemComponent implements OnInit {
  public frm: UntypedFormGroup;

  @Input() item:any;
  @Input() pallet:any;
  @Input() listPalletVoid:any;
  
  public boolean:Boolean = true;

  public No:any;
  public loading:Boolean = false;

  constructor(private formBuilder: UntypedFormBuilder, 
    private jsonService: JsonService
    , private wmsService: WmsService
    , private popoverController: PopoverController
    , private interceptService: InterceptService) { 


    this.frm = this.formBuilder.group(
      {
        Quantity: [0, Validators.required],
       
      
      }
    )
  }

  ngOnInit() {

    console.log(this.item);

    console.log(this.pallet);
  }


  public async closePopover() {
    this.popoverController.dismiss({});
  }



 async onSubmit(){
 
    if (this.frm.valid) {


      this.boolean = false;
      this.loading = true;

      let obj = await this.jsonService.formToJson(this.frm); 
     
     if(obj.Quantity <= this.item.PLUQuantity && obj.Quantity > 0){

      this.popoverController.dismiss({qty: obj.Quantity,palletNew:this.No});

        }

    }

 }


  
  add(){

    let qty =  this.frm.get('Quantity').value;
  
    if(qty < this.item.PLUQuantity){

      qty +=1
  
      this.frm.get('Quantity').setValue(qty);
    }
    
  
    }
  
    res(){
  
      let qty =  this.frm.get('Quantity').value;
  
      if(qty > 1){
   
       qty -=1
  
       this.frm.get('Quantity').setValue(qty);
       }
  
    }

    onSelect(p){

      this.No = p;
    
      console.log(this.No);
    }

}
