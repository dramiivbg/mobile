import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
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
 // @Input() listPalletVoid:any;


  public No:any;


  constructor(private formBuilder: UntypedFormBuilder, 
    private jsonService: JsonService
    , private wmsService: WmsService
    , private popoverController: PopoverController
    , private interceptService: InterceptService
    ,private barcodeScanner: BarcodeScanner) { 


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


      let obj = await this.jsonService.formToJson(this.frm); 
     
     if(obj.Quantity <= this.item.PLUQuantity && obj.Quantity > 0){

      this.popoverController.dismiss({qty: obj.Quantity,palletNew:this.No});

        }

    }

 }

    onSelect(p){

      this.No = p;
    
      console.log(this.No);
    }


    onScanPick(){

      this.barcodeScanner.scan().then(
       async barCodeData => {
          let code = barCodeData.text;
       
          if(code != ''){
      
              let find = this.item.PLUNo === code.toUpperCase() || this.item.PLUSerialNo === code.toUpperCase();

              if(!find){
                let identifier = await this.wmsService.GetItemIdentifier(code.toUpperCase());
                console.log('identifier =>',identifier);
          
                 if(!identifier.Error && !identifier.error){
      
                  for (const key in identifier.ItemIdentifier) {
                    
                      find = (this.item.PLUNo === identifier.ItemIdentifier[key].ItemNo && this.item.PLUVariantCode === identifier.ItemIdentifier[key].VariantCode);
                    
                   }
            
                  }
              }
                if(find){

                  let qty =  this.frm.controls.Quantity.value;
                  qty+=1;
                  this.frm.controls.Quantity.setValue(qty);
                }
                 
            }           
                 
        }
      ).catch(
        err => {
          console.log(err);
        }
      )

    }

}
