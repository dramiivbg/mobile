import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
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
  @Input() process:any;
  public item:any;
  public frm: UntypedFormGroup;
  public qty = 0;
  public count = 0;
  public seriales = [];
  constructor(private intServ: InterceptService
    , private formBuilder: UntypedFormBuilder
    , private jsonService: JsonService
    , private wmsService: WmsService
    , private popoverController: PopoverController,private barcodeScanner: BarcodeScanner) { 
    
    }

  ngOnInit() {

    this.frm = this.formBuilder.group(
      {
        qty: [this.list.quantity, Validators.required],
        qtyToShip: [this.process === 'Sales Order'?this.list.qtytoShip:this.list.ReturnQtytoReceive, Validators.required]
       
      }
    )

   console.log(this.list);
    
    
  if(this.process === undefined){
    this.item = (this.list.seriales.length === 1 )?this.list:undefined;
    console.log(this.item);
   this.qty = this.list.seriales.length;
    console.log(this.list);
    this.frm.controls.qtyToShip.disable();

  } 
 
  }

  
  public async closePopover() {
    this.popoverController.dismiss({qty:undefined});
  }

  public async onSubmit(){

    let obj = await this.jsonService.formToJson(this.frm); 
    console.log(obj);
    
    switch(this.process === undefined){
      case true:
        if(this.frm.valid && this.item != undefined){
          this.popoverController.dismiss({qty:obj.qty, seriales: this.seriales, obj: this.list,type:'normal'});
        }else{
          this.popoverController.dismiss({qty:this.count, seriales: this.seriales,obj: this.list,type:'serial'});
        }
        break;

      default:

        if(this.frm.valid)this.popoverController.dismiss({qtyToShip: obj.qtyToShip,qty: obj.qty});
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

  onScanPick(num){

    
  this.barcodeScanner.scan().then(
    barCodeData => {
      let code = barCodeData.text;
   
      if(code != ''){
        switch(num){
          case 0:
            if(code.toUpperCase() === this.list.id.toUpperCase()){
              let qty =  this.frm.controls.qty.value;
              qty+=1;
              this.frm.controls.qty.setValue(qty);
            }           
            break;

          default:
            if(code.toUpperCase() === this.list.id.toUpperCase()){

              let qtyToShip =  this.frm.controls.qtyToShip.value;
              qtyToShip+=1;
              this.frm.controls.qtyToShip.setValue(qtyToShip);
            }
      
            break;
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
