import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
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

  public binCode:any;

  public bins:any;

  
  constructor(private intServ: InterceptService
    , private formBuilder: FormBuilder
    , private jsonService: JsonService
    , private wmsService: WmsService
    , private popoverController: PopoverController
    , private interceptService: InterceptService,
    private router: Router,
    private barcodeScanner: BarcodeScanner
    
  ) { 


    this.frm = this.formBuilder.group(
      {
        Qty: ['0', Validators.required],
       
      }
    )
  }

async   ngOnInit() {
    console.log(this.item);
    if(this.item.Quantity == 1){
      this.frm.patchValue({
        Qty: this.item.Quantity
      });

     document.getElementById('input').setAttribute('disabled','true');
     }
     
     this.binCode = this.item.place;

     let bin =  await this.wmsService.GetPossiblesBinFromPutAwayV2(this.item.No);

     this.bins = bin.Bins;
  }

  async onSubmit(){

    
    if (this.frm.valid) {

      let obj = await this.jsonService.formToJson(this.frm);

      this.popoverController.dismiss({qty: obj.Qty, item:this.item,updateBin:this.binCode});
    }
  }


  
  onConfirm() {

    this.barcodeScanner.scan().then(
      async (barCodeData) => {
        let code = barCodeData.text;   
  
          let line = this.bins.find(bin => bin.BinCode === code.toUpperCase());

          if(line === undefined || line === null){
            this.intServ.alertFunc(this.jsonService.getAlert('error', '', `The bin ${code.toUpperCase()} 
            does not exist within the ${this.item.No} `));
          }else{

            this.binCode = line.BinCode;
          }

          console.log(line);    

      }
    ).catch(
      err => {
        console.log(err);
      }
    )

  }

  onChangeBinOne(bin:any){


    this.binCode = bin;

  }



 async  closePopover(){

   this.popoverController.dismiss({qty:null});
  }
}
