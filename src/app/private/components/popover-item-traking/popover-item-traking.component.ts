import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { PopoverController } from '@ionic/angular';
import { InterceptService } from '@svc/intercept.service';
import { JsonService } from '@svc/json.service';
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
  public boolean:boolean;
  public lp: any;
  @Input() options: any;

  public seriales:any[] = [];


  public item: any;

  public frm: FormGroup;
  constructor(private formBuilder: FormBuilder, public popoverController: PopoverController,private barcodeScanner: BarcodeScanner, 
    private jsonService: JsonService,  private intServ: InterceptService) {
    this.frm = this.formBuilder.group(
      {
        Qty: ['0', Validators.required],
        requestedDeliveryDate: ['', Validators.required],
        TotalToReceive: [0, Validators.required],
        SerialNo: [ [], Validators.required],
        LotNo: ['', Validators.required],
        QtyBase: [0, Validators.required],
        QtyHandleBase: [0, Validators.required],



      }
    )
  }

  ngOnInit() {

    //  console.log(this.options);

    this.item = (this.options.item !== null) ? this.options.item : null;
    this.lp = (this.options.lp !== null) ? this.options.lp : null;

    console.log(this.item, this.lp);

    switch (this.item.trakingCode) {
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
        this.boolean = true;
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

        this.seriales.push(code.toLocaleUpperCase());
        
     
        this.frm.patchValue({
          SerialNo: this.seriales
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
