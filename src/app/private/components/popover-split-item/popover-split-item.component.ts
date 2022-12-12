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

  ngOnInit() {
    console.log(this.item);
     this.binCode = this.item.place;
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
        
        try {
          let bin = await this.wmsService.GetPossiblesBinFromPutAwayV2(this.item.No);

          if(bin.Error || bin.error) throw new Error((bin.Error)? bin.Error.Message: bin.error.message);

          if(bin.message) throw new Error(bin.message);
                   
          console.log(bin);
  
          let line = bin.Bins.find(bin => bin.BinCode === code.toUpperCase());

          if(line === undefined || line === null){
            this.intServ.alertFunc(this.jsonService.getAlert('error', '', `The bin ${code.toUpperCase()} 
            does not exist within the ${this.item.No} `));
          }else{

            this.binCode = line.BinCode;
          }



  
          console.log(line);
          
        } catch (error) {
          
          this.intServ.alertFunc(this.jsonService.getAlert('error', '', error.message));
        }

      }
    ).catch(
      err => {
        console.log(err);
      }
    )

  }



 async  closePopover(){

   this.popoverController.dismiss({qty:null});
  }
}
