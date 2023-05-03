import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { PopoverController } from '@ionic/angular';
import { InterceptService } from '@svc/intercept.service';
import { JsonService } from '@svc/json.service';
import { WmsService } from '@svc/wms.service';
import { PopoverListSerialLpComponent } from '../popover-list-serial-lp/popover-list-serial-lp.component';

@Component({
  selector: 'app-popover-counting',
  templateUrl: './popover-counting.component.html',
  styleUrls: ['./popover-counting.component.scss'],
})
export class PopoverCountingComponent implements OnInit {

  @Input() list:any;
  @Input() picking = false;
  @Input() automate: boolean;
  public item:any;
  public frm: FormGroup;
  public qty = 0;
  public count = 0;
  public seriales = [];
  constructor(private intServ: InterceptService
    , private formBuilder: FormBuilder
    , private jsonService: JsonService
    , private wmsService: WmsService
    , private popoverController: PopoverController,private barcodeScanner: BarcodeScanner) { 
    
    }

  ngOnInit() {

    this.frm = this.formBuilder.group(
      {
        qty: ['', Validators.required],
        qtyToShip: ['', Validators.required]
       
      }
    )

   
    
    
  if(!this.picking){
    this.item = (this.list.seriales.length === 1 )?this.list:undefined;
    console.log(this.item);
   this.qty = this.list.seriales.length;
    console.log(this.list);
    this.frm.controls.qtyToShip.disable();

  }else{

    (!this.automate)?this.frm.controls.qty.disable():this.frm.controls.qty.setValue(this.list.quantity);
  }  
 
  }

  
  public async closePopover() {
    this.popoverController.dismiss({qty:undefined});
  }

  public async onSubmit(){

    let obj = await this.jsonService.formToJson(this.frm); 
    switch(this.picking){
      case false:
        if(this.frm.valid && this.item != undefined){
          this.popoverController.dismiss({qty:obj.qty, seriales: this.seriales, obj: this.list,type:'normal'});
        }else{
          this.popoverController.dismiss({qty:this.count, seriales: this.seriales,obj: this.list,type:'serial'});
        }
        break;

      default:

         if(this.automate)this.list.quantity = obj.qty;
        if(this.frm.valid)this.popoverController.dismiss({qtyToShip: obj.qtyToShip,qty: this.list.quantity});
        break;

    }
   
  }

 async onScan(){

  
  this.barcodeScanner.scan().then(
    barCodeData => {
      let code = barCodeData.text;
   
    switch(this.count != this.qty){
     case true:
      let line = this.list.seriales.find(x => code.toUpperCase() === x.SerialNo);
      let line2 = this.seriales.find(x => code.toUpperCase() === x.SerialNo);

      if(line != undefined && (line2 == null || line2 === undefined)){
        line['proceded'] = false;
        this.seriales.push(line);
      } 
      this.count = this.seriales.length;
      break;
    }
  
    }
  ).catch(
    err => {
      console.log(err);
    }
  )
  }

  async lists(){

    const popover = await this.popoverController.create({
      component: PopoverListSerialLpComponent,
      cssClass: 'popoverListSerialLpComponent-modal',
      componentProps: {list:this.seriales},
      backdropDismiss: false
      
    });
    await popover.present();
    const { data } = await popover.onDidDismiss();

     this.seriales = data.list;
     this.count = this.seriales.length;
 
  }
}
