import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  public frm: FormGroup;

  @Input() lp:any;

  
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

    console.log(this.lp);
  }


  public async closePopover() {
    this.popoverController.dismiss({});
  }



 async onSubmit(){


    if (this.frm.valid) {


      this.boolean = false;
      this.loading = true;

      let obj = await this.jsonService.formToJson(this.frm);



     
     
     if(obj['Quantity'] <= this.lp.fields.PLUQuantity){

      if(obj['Quantity'] > 0){


        
      try {

        let lpN = await this.wmsService.GenerateEmptyLP(this.lp.fields.PLUZoneCode,this.lp.fields.PLULocationCode,'', 'Single');
       

        let qtyN = obj['Quantity'];
  
        let qty = this.lp.fields.PLUQuantity;
  
        let lpO = this.lp.fields.PLULPDocumentNo;
  
        let objP =   {
          NewLicensePlateCode: lpN.LPNo,
          NewQuantity: qtyN,
          OriginalQuantityModified: qty,
          OriginalLicensePlateCode: lpO
        };
  
  
        let res = await this.wmsService.SplitLPSingle(objP);

        console.log(res);

        if(res.Error) throw new Error(lpN.Error.Message);


        Swal.fire(
          'Success!',
          `Has been successfully created`,
          'success'
        )

       

        this.popoverController.dismiss({});

      

        
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
        text: `The quantity must not be greater than the original License Plate Single ${this.lp.fields.PLULPDocumentNo}`,
        footer: ''
      });

        }

    }

 }


  
  add(){

    let qty =  this.frm.get('Quantity').value;
  
    if(qty < this.lp.fields.PLUQuantity){

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
