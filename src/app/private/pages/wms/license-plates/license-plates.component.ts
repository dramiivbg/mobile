import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PopoverController } from '@ionic/angular';
import { InterceptService } from '@svc/intercept.service';
import { JsonService } from '@svc/json.service';
import { SyncerpService } from '@svc/syncerp.service';
import { WmsService } from '@svc/wms.service';
import {GeneralService} from '@svc/general.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-license-plates',
  templateUrl: './license-plates.component.html',
  styleUrls: ['./license-plates.component.scss'],
})
export class LicensePlatesComponent implements OnInit {
  public item: any = {};
  public lp: any = {};
  public lstUoM: any = [];
  public frm: FormGroup;
  @Input() options: any = {};

  constructor(private intServ: InterceptService
    , private formBuilder: FormBuilder
    , private jsonService: JsonService
    , private wmsService: WmsService
    , private popoverController: PopoverController
    , private interceptService: InterceptService,
    private router: Router
    
  ) { 

    let objFunc = {
      func: () => {
        this.onBack();
      }

    };

    this.intServ.appBackFunc(objFunc);

    this.frm = this.formBuilder.group(
      {
        TotalToReceive: ['0', Validators.required],
        NoofPackLP: ['0', Validators.required],
        PackUnitUoM: ['', Validators.required],
      }
    )
  }

  public ngOnInit() {
    this.item = this.options.item === undefined ? {} : this.options.item;
    this.lp = this.options.lp === undefined ? {} : this.options.lp;
    var lstUnitofMeasure = this.options.lstUoM === undefined ? {} : this.options.lstUoM;
    this.lstUoM = lstUnitofMeasure.UnitOfMeasure === undefined ? {} : lstUnitofMeasure.UnitOfMeasure;

    console.log(this.lstUoM);
  }

  onBack() {
    this.router.navigate(['page/wms/wmsMain']);
  }

  public async onSubmit() {

  
    if (this.frm.valid) {

    
        this.interceptService.loadingFunc(true);

        let obj = await this.jsonService.formToJson(this.frm);

        
        
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
  this.interceptService.alertFunc(this.jsonService.getAlert('alert',' ','Please put how many license plate you want'));
 
}else

   if(obj.NoofPackLP == 0){
    this.interceptService.loadingFunc(false);
    this.interceptService.alertFunc(this.jsonService.getAlert('alert',' ',' Please put how many packs each license plate will have'));
    
   }else{


      obj['TotalToReceive'] = obj.TotalToReceive * obj.NoofPackLP;

      let rsl = await this.wmsService.CreateLPFromWarehouseReceiptLine([obj]);

      console.log(rsl);

      console.log(rsl);

      if(rsl.Created){

        
      this.interceptService.loadingFunc(false);

      this.interceptService.alertFunc(this.jsonService.getAlert('success',' ','License plates have been created successfully'));

       
      this.popoverController.dismiss({data: 'creado'});

      }else{

        this.interceptService.loadingFunc(false);
        this.interceptService.alertFunc(this.jsonService.getAlert('alert',' ','You can not send more than you expect to receive'));
      }

    
     }
       
  
        

      

    

   
    }
  }

  public async closePopover() {
    this.popoverController.dismiss({});
  }

}
