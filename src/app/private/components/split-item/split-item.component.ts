import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  public frm: FormGroup;

  @Input() item:any;
  @Input() pallet:any;

  
  public boolean:Boolean = true;

  public loading:Boolean = false;

  constructor(private formBuilder: FormBuilder, 
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
  }


  public async closePopover() {
    this.popoverController.dismiss({});
  }



 async onSubmit(){


    if (this.frm.valid) {


      this.boolean = false;
      this.loading = true;

      let obj = await this.jsonService.formToJson(this.frm);



     
     
     if(obj['Quantity'] <= this.item.PLUQuantity){

      if(obj['Quantity'] > 0){


        
      try {

        let lpN = await this.wmsService.GenerateEmptyLP(this.pallet.fields.PLUZoneCode,this.pallet.fields.PLULocationCode,'', 'Pallet');
       

        let qtyN = obj['Quantity'];
  
        let qty = this.item.PLUQuantity - qtyN;
  
        let itemNo = this.item.PLUNo;
  
        let objI = {
          NewLicensePlateCode: lpN.PLUNo,
          NewQuantity: qtyN,
          OriginalQuantityModified: qty,
          OriginalLicensePlateCode: this.item.PLULPDocumentNo,
          ItemCode: itemNo
        };
  
  
        let res = await this.wmsService.SplitLPSingle(objI);

        console.log(res);

        if(res.Error) throw new Error(res.Error.Message);


        Swal.fire(
          'Success!',
          `Has been successfully created`,
          'success'
        )

       

        this.popoverController.dismiss({data: 'split', obj: this.item.PLULPDocumentNo});

      

        
      } catch (error) {


        this.boolean = true;
        this.loading = false;

        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error.message,
          footer: ''
        });
        
      }

      }else{

        this.boolean = true;
        this.loading = false;

        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: `The amount must be greater than zero`,
          footer: ''
        });
        
        
      }

  
     }else{

      this.boolean = true;
      this.loading = false;
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: `The quantity must not be greater than the original Item ${this.item.PLUNo}`,
        footer: ''
      });

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

}
