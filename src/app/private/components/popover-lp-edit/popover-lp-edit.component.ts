import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { InterceptService } from '@svc/intercept.service';
import { JsonService } from '@svc/json.service';
import { WmsService } from '@svc/wms.service';

@Component({
  selector: 'app-popover-lp-edit',
  templateUrl: './popover-lp-edit.component.html',
  styleUrls: ['./popover-lp-edit.component.scss'],
})
export class PopoverLpEditComponent implements OnInit {

  public frm: UntypedFormGroup;

  @Input() options : any;
  constructor(private intServ: InterceptService
    , private formBuilder: UntypedFormBuilder, private router: Router, private popover: PopoverController, private interceptService: InterceptService,
    private jsonService: JsonService, private wmsService: WmsService
    ) {

    let objFunc = {
      func: () => {
        this.onBack();
      }

    };

    this.intServ.appBackFunc(objFunc);

   

    this.frm = this.formBuilder.group(
      {
        //TotalToReceive: [1, Validators.required],
        NoofPackLP: ['', Validators.required],
        PackUnitUoM: ['', Validators.required],
      }
    )
  }



  ngOnInit() {

   console.log(this.options.lp)

  this.frm.controls['NoofPackLP'].setValue(this.options.lp.fields[0].PLUQuantity.toFixed(1));
   
  }


  onBack() {
    this.router.navigate(['page/wms/wmsMain']);
  }
   

  closePopover(){


    this.popover.dismiss({});

  }

  async onSubmit(){

    
  
    if (this.frm.valid) {

    
     // this.interceptService.loadingFunc(true);

      let obj = await this.jsonService.formToJson(this.frm);

      console.log(obj);

     /* 
      
      obj['No'] = this.item.No;
      obj['ItemNo'] = this.item.ItemNo;
      obj['BinCode'] = this.item.BinCode;
      obj['UnitofMeasureCode'] = this.item.UnitofMeasureCode;
      obj['TotalToReceive'] = obj.TotalToReceive;
      obj['NoofPackLP'] = obj.NoofPackLP;
      obj['PackUnitUoM'] = obj.PackUnitUoM;
      obj['LineNo']  = this.item.LineNo;


if(obj.TotalToReceive == 0){
this.interceptService.loadingFunc(false);
this.interceptService.alertFunc(this.jsonService.getAlert('alert','alert','please put how many license plate you want'));

}else

 if(obj.NoofPackLP == 0){
  this.interceptService.loadingFunc(false);
  this.interceptService.alertFunc(this.jsonService.getAlert('alert','alert',' please put how many packs each license plate will have'));
  
 }else{


    obj['TotalToReceive'] = obj.TotalToReceive * obj.NoofPackLP;

    let rsl = await this.wmsService.CreateLPFromWarehouseReceiptLine([obj]);

    console.log(rsl);

    if(rsl.Created){

      
    this.interceptService.loadingFunc(false);

    this.interceptService.alertFunc(this.jsonService.getAlert('sucess','sucess','license plates have been created successfully'));
     
    this.popoverController.dismiss({});

    }else{

      this.interceptService.loadingFunc(false);
      this.interceptService.alertFunc(this.jsonService.getAlert('alert','alert','you can not send more than you expect to receive'));
    }

  
   }
     

      

    

  

 
  }

  
*/
  }

}

}
