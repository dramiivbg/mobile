import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { PopoverController } from '@ionic/angular';
import { InterceptService } from '@svc/intercept.service';
import { JsonService } from '@svc/json.service';
import { WmsService } from '@svc/wms.service';
import { PopoverConfigurationCodeComponent } from '../popover-configuration-code/popover-configuration-code.component';
import { PopoverListSNComponent } from '../popover-list-sn/popover-list-sn.component';

@Component({
  selector: 'app-popover-item-traking',
  templateUrl: './popover-item-traking.component.html',
  styleUrls: ['./popover-item-traking.component.scss'],
})
export class PopoverItemTrakingComponent implements OnInit {

  public serial: boolean = false;
  public lot: boolean = false;
  public exp: boolean = false;
  public lp: any;
  @Input() options: any;

  public code:any;
  public seriales:any[] = [];


  public item: any;

  public frm: FormGroup;
  constructor(private formBuilder: FormBuilder, public popoverController: PopoverController,private barcodeScanner: BarcodeScanner, 
    private jsonService: JsonService,  private intServ: InterceptService, private wmsService: WmsService) {
    this.frm = this.formBuilder.group(
      {
        requestedDeliveryDate: ['', Validators.required],
        TotalToReceive: [0, Validators.required],
        SerialNo: [ [], Validators.required],
        LotNo: ['', Validators.required],
        QtyBase: [0, Validators.required],
        QtyHandleBase: [0, Validators.required],



      }
    )
  }

 async ngOnInit() {

    //  console.log(this.options)

    this.item = (this.options.item !== null) ? this.options.item : null;
    this.lp = (this.options.lp !== null) ? this.options.lp : null;

    let res = await this.wmsService.configurationTraking(this.item.trakingCode);
    this.code = await this.wmsService.listCode(res);

    console.log(this.code);
 

   // console.log(this.item, this.lp);

    switch (this.code.lines) {
      case "LOTSNSALES":
        this.lot = true;
        this.serial = true;
        this.exp = true;
        break;

      case "LOTALL":
        this.lot = true;
        break;

      case "LOTALLEXP":
        this.lot = true;
        this.exp = true;
        break;

      case (["SNALL", "SN-PROD", "SNSALES"].indexOf(this.item.trakingCode) + 1 && this.item.trakingCode):
        this.serial = true;
        break;

      case "FREEENTRY":
      
        break;

    }


  }

  addField(num:any){
 
    if(num === 1) this.serial = true;
    if(num === 2) this.lot = true;
    if(num === 3) this.exp = true;


  }

  resField(num:any){
 
    if(num === 1) this.serial = false;
    if(num === 2) this.lot = false;
    if(num === 3) this.exp = false;

  }

  scanSN(){

    this.barcodeScanner.scan().then(
      barCodeData => {
        let code = barCodeData.text;
        let line = undefined;

        line = this.seriales.find(serial => serial === code.toUpperCase());
        if(line === null || line === undefined){

          this.seriales.push(code.toUpperCase());
        }else{

          this.intServ.alertFunc(this.jsonService.getAlert('alert', '', `The serial ${code.toUpperCase()} already exists`));
        }
     
        
     
        this.frm.patchValue({
          SerialNo: this.seriales,
          TotalToReceive: this.seriales.length

        });


      }
    ).catch(
      err => {
        console.log(err);
      }
    )

  }

  scanLOT(){

    this.barcodeScanner.scan().then(
      barCodeData => {
        let code = barCodeData.text;
      
        this.frm.patchValue({
          LotNo: code.toUpperCase()
        });
      }
    ).catch(
      err => {
        console.log(err);
      }
    )

  }

  async closePopover() {

    if(this.seriales.length > 0){

      this.intServ.alertFunc(this.jsonService.getAlert('confirm', 'Are you sure?', 'All data will be lost', () => {

        this.popoverController.dismiss({});
      }));
    }else{
      this.popoverController.dismiss({});
    }
  
   
  }

async popoverConfigCode(){

 
  const popover = await this.popoverController.create({
    component: PopoverConfigurationCodeComponent,
    cssClass: 'popoverConfigurationCodeComponent-modal',
    componentProps: {code:this.code},
    
  });
  await popover.present();
  const { data } = await popover.onDidDismiss();

  }

async  listSN(){

  let seriales = this.frm.get('SerialNo').value;

  const popover = await this.popoverController.create({
    component: PopoverListSNComponent,
    cssClass: 'popoverListSNComponent-modal',
    componentProps: {seriales},
    
  });
  await popover.present();
  const { data } = await popover.onDidDismiss();
  }


}
