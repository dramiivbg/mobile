import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { PopoverController } from '@ionic/angular';
import { InterceptService } from '@svc/intercept.service';
import { JsonService } from '@svc/json.service';
import { WmsService } from '@svc/wms.service';
import { PopoverConfigurationCodeComponent } from '../popover-configuration-code/popover-configuration-code.component';
import { PopoverListSNComponent } from '../popover-list-sn/popover-list-sn.component';
import { Storage } from '@ionic/storage';

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
  public trakingOpen:any;
  public trakingClose:any;
  @Input() options: any;

  public receive:number = 0;
  public code:any;
  public list:any[] = [];

  public item: any;

  public frm: FormGroup;
  constructor(private formBuilder: FormBuilder, public popoverController: PopoverController,private barcodeScanner: BarcodeScanner, 
    private jsonService: JsonService,  private intServ: InterceptService, private wmsService: WmsService,  private storage: Storage) {

   
    this.frm = this.formBuilder.group(
      {
        requestedDeliveryDate: ['', Validators.required],
        TotalToReceive: [0, Validators.required],
        SerialNo: ['', Validators.required],
        LotNo: ['', Validators.required],
        QtyBase: [0, Validators.required],



      }
    )
  }

 async ngOnInit() {
  
  this.item = (this.options.item !== null) ? this.options.item : null;
  this.lp = (this.options.lp !== null) ? this.options.lp : null;
 this.trakingOpen = (this.options.trakingOpen !== null) ? this.options.trakingOpen : [];

  let res = await this.wmsService.configurationTraking(this.item.trakingCode);
  this.code = await this.wmsService.listCode(res);

  this.serial = (this.code.lines.SNPurchaseInboundTracking === true)?true:false;

     this.lot = (this.code.lines.LotPurchaseInboundTracking == true)?true:false;

     this.exp = (this.code.lines.ManExpirDateEntryReqd == true )?true:false; 


    this.receive  = (await this.storage.get(`${this.item.LineNo} receive`) != undefined || await this.storage.get(`${this.item.LineNo} receive`) != null)?await this.storage.get(`${this.item.LineNo} receive`):0;

    this.frm.patchValue({

      TotalToReceive: this.receive
    });
   
   

    console.log(this.code);
    console.log(this.item);
 

    console.log(this.item);

    this.intServ.loadingFunc(false);
     

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
        let line2 = undefined;

        line = this.list.find(x => x.SerialNo === code.toUpperCase());
        line2 = this.trakingOpen.find(x => x.SerialNo === code.toUpperCase());
        if((line === null || line === undefined) && (line2 === null || line2 === undefined)){

          this.frm.patchValue({
            SerialNo: code.toUpperCase(),
        
          });

        
        }else{

          this.intServ.alertFunc(this.jsonService.getAlert('alert', '', `The serial ${code.toUpperCase()} already exists`));
        }
    

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

    if(this.list.length > 0){

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

async  view(){

  for (const key in this.trakingOpen) {

  let  obj =   {
      WarhouseReceiptNo: "",
      ItemNo: "",
      SourceNo: "",
      SourceRefNo: "",
      Qty: 0,
      SerialNo: "",
      LotNo: "",
      ExperationDate: "",
      proceded: true
    }

    obj.WarhouseReceiptNo = this.item.No;
    obj.ItemNo = this.item.ItemNo;
    obj.SourceNo = this.item.SourceNo;
    obj.SourceRefNo = this.item.SourceLineNo;
    obj.Qty = this.trakingOpen[key].Quantity;
    obj.SerialNo = this.trakingOpen[key].SerialNo;
    obj.LotNo = this.trakingOpen[key].LotNo;
    obj.ExperationDate = this.trakingOpen[key].ExpirationDate;

    let line = this.list.find(x => x.SerialNo === obj.SerialNo);

    if(line === undefined || line === null)this.list.push(obj);
  }

  const popover = await this.popoverController.create({
    component: PopoverListSNComponent,
    cssClass: 'popoverListSNComponent-modal',
    componentProps: {list:this.list},
    
  });
  await popover.present();
  const { data } = await popover.onDidDismiss();

   switch(data.data){

    case 'Delete':
      let res = await this.wmsService.GetItemTrackingSpecificationOpen(this.item.ItemNo,this.item.SourceNo,this.item.SourceLineNo);
      this.trakingOpen = (res.Error === undefined)?await this.wmsService.listTraking(res.TrackingSpecificationOpen):this.trakingOpen;
      break;

   }
  }

 async onSubmit(){
  
  if(this.list.length > 0){
      this.intServ.loadingFunc(true);  
      try {
        for (const key in this.list) {
           await this.wmsService.UpdateItemTrackingSpecificationOpen(this.list[key]);    
        }
        this.intServ.loadingFunc(false);
        this.intServ.alertFunc(this.jsonService.getAlert('success','','The operation was successfully performed',async() => {        
          let res = await this.wmsService.GetItemTrackingSpecificationOpen(this.item.ItemNo,this.item.SourceNo,this.item.SourceLineNo);
          this.trakingOpen = (res.Error === undefined)?await this.wmsService.listTraking(res.TrackingSpecificationOpen):this.trakingOpen;

          let list = [
            {
              WarehouseReceiptLines: [
                {
                  No: this.item.No,
                  SourceNo: this.item.SourceNo,
                  ItemNo: this.item.ItemNo,
                  LineNo: this.item.LineNo,
                  ZoneCode: this.item.ZoneCode,
                  LocationCode: this.item.LocationCode,
                  BinCode: this.item.BinCode,
                  QtyToReceive: this.frm.get('TotalToReceive').value
                }
              ]
            }
          ]
          
        

           await this.wmsService.Update_WsheReceiveLine(list); 

         this.storage.set(`${this.item.LineNo} receive`,this.frm.get('TotalToReceive').value);

          this.list = [];       
        }));
                   
      } catch (error) {
        this.intServ.loadingFunc(false);
        this.intServ.alertFunc(this.jsonService.getAlert('error','',error.message));       
      }
    }   
  }

  save(){

    if(this.frm.valid && this.frm.get('QtyBase').value > 0){

      let res = new Date(this.frm.get('requestedDeliveryDate').value);

      let fecha = res.getFullYear()+'-'+(res.getMonth()+1)+'-'+res.getDate();
  
      this.frm.patchValue({
        requestedDeliveryDate: fecha
      });


      let obj =   {
        WarhouseReceiptNo: "",
        ItemNo: "",
        SourceNo: "",
        SourceRefNo: "",
        Qty: 0,
        SerialNo: "",
        LotNo: "",
        ExperationDate: "",
        proceded: false
      }

      obj.WarhouseReceiptNo = this.item.No;
      obj.ItemNo = this.item.ItemNo;
      obj.SourceNo = this.item.SourceNo;
      obj.SourceRefNo = this.item.SourceLineNo;
      obj.Qty = this.frm.get('QtyBase').value;
      obj.SerialNo = this.frm.get('SerialNo').value;
      obj.LotNo = this.frm.get('LotNo').value;
      obj.ExperationDate = this.frm.get('requestedDeliveryDate').value;

      this.receive += obj.Qty;

      this.list.push(obj);

      this.frm.patchValue({

        TotalToReceive: this.receive
      });

      this.frm.patchValue({

        SerialNo: "",
        LotNo: "",
        requestedDeliveryDate: "",
        QtyBase: 0
      });

      console.log(this.list);
    }

  }


}
