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
import { TypeCheckCompiler } from '@angular/compiler/src/view_compiler/type_check_compiler';

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
 this.trakingClose =  (this.options.trakingClose !== null) ? this.options.trakingClose : [];

  let res = await this.wmsService.configurationTraking(this.item.trakingCode);
  this.code = await this.wmsService.listCode(res);

  this.serial = (this.code.lines.SNPurchaseInboundTracking === true )?true:false;

     this.lot = (this.code.lines.LotPurchaseInboundTracking == true )?true:false;

     this.exp = (this.code.lines.ManExpirDateEntryReqd == true)?true:false; 

    this.receive  = this.item.QtytoReceive;
  
    this.storage.set(`${this.item.LineNo} receive`, this.item.QtytoReceive);

    this.frm.patchValue({

      TotalToReceive: this.receive
    });
   
   

    console.log(this.code);
    console.log(this.item);
 

    console.log(this.item);

    this.intServ.loadingFunc(false);
     

  }

 

  scanSN(){

    this.barcodeScanner.scan().then(
      barCodeData => {
        let code = barCodeData.text;
        let line = undefined;
        let line2 = undefined;
        let line3 = undefined;

        line = this.list.find(x => x.SerialNo === code.toUpperCase());
        line2 = this.trakingOpen.find(x => x.SerialNo === code.toUpperCase());
        line3 = this.trakingClose.find(x => x.SerialNo === code.toUpperCase());
        if((line === null || line === undefined) && (line2 === null || line2 === undefined) && (line3 === null || line3 === undefined)){

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

    let line = this.list.find(x => x.proceded === false);
    if(line != undefined){

      this.intServ.alertFunc(this.jsonService.getAlert('confirm', 'Are you sure?', 'All data will be lost', () => {

        this.popoverController.dismiss({receive:this.receive});
      }));
    }else{
      this.popoverController.dismiss({receive:this.receive});
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

  console.log(this.trakingOpen);

  const popover = await this.popoverController.create({
    component: PopoverListSNComponent,
    cssClass: 'popoverListSNComponent-modal',
    componentProps: {list:this.list, item:this.item},
    
  });
  await popover.present();
  const { data } = await popover.onDidDismiss();

  if(data != undefined){

    switch(data.data){

      case "Delete":
        let res = await this.wmsService.GetItemTrackingSpecificationOpen(this.item.ItemNo,this.item.SourceNo,this.item.SourceLineNo);
        this.trakingOpen = (res.Error === undefined)?await this.wmsService.listTraking(res.TrackingSpecificationOpen):this.trakingOpen;
        console.log(this.trakingOpen);
        this.receive = await this.storage.get(`${this.item.LineNo} receive`);
        this.frm.patchValue({
          TotalToReceive: this.receive
        });

       this.list.splice(data.index,1);
          

        break;
  
     }
  }
 
  }

 async onSubmit(){
  
  let line = this.list.find(x => x.proceded === false);
  if(line !== undefined){
      this.intServ.loadingFunc(true);  
      try {
        for (const key in this.list) {
          if(this.list[key].proceded === false){

            await this.wmsService.UpdateItemTrackingSpecificationOpen(this.list[key]);   
          }
           
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

    if(this.serial && this.exp && this.lot){

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
  
        this.receive = ((this.item.QtytoReceive === this.item.QtyOutstanding) && (this.receive === this.item.QtytoReceive))?0: this.receive;
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

    }else if(this.serial && this.exp && this.lot === false){

      if(this.frm.get('SerialNo').value != '' && this.frm.get('requestedDeliveryDate').value != '' && this.frm.get('QtyBase').value > 0){

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
  
        this.receive = ((this.item.QtytoReceive === this.item.QtyOutstanding) && (this.receive === this.item.QtytoReceive))?0: this.receive;        
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


    }else if(this.serial && this.exp == false && this.lot){

      
      if(this.frm.get('SerialNo').value != '' && this.frm.get('LotNo').value != '' && this.frm.get('QtyBase').value > 0){

        let res = new Date(this.frm.get('requestedDeliveryDate').value);
  
        let fecha = (this.frm.get('requestedDeliveryDate').value != '')?res.getFullYear()+'-'+(res.getMonth()+1)+'-'+res.getDate():'';
    
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
  
        this.receive = ((this.item.QtytoReceive === this.item.QtyOutstanding) && (this.receive === this.item.QtytoReceive))?0: this.receive;
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

    }else if(this.serial === false && this.exp && this.lot){

      if(this.frm.get('requestedDeliveryDate').value != '' && this.frm.get('LotNo').value != '' && this.frm.get('QtyBase').value > 0){

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
  
        this.receive = ((this.item.QtytoReceive === this.item.QtyOutstanding) && (this.receive === this.item.QtytoReceive))?0: this.receive;        
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


    }else if(this.serial === false && this.exp && this.lot === false){

      if(this.frm.get('requestedDeliveryDate').value != ''  && this.frm.get('QtyBase').value > 0){

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
  
        this.receive = ((this.item.QtytoReceive === this.item.QtyOutstanding) && (this.receive === this.item.QtytoReceive))?0: this.receive;
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
    }else if(this.serial  && this.exp === false && this.lot === false){


      if(this.frm.get('SerialNo').value != '' && this.frm.get('QtyBase').value > 0){

        let res = new Date(this.frm.get('requestedDeliveryDate').value);
  
        let fecha = (this.frm.get('requestedDeliveryDate').value != '')?res.getFullYear()+'-'+(res.getMonth()+1)+'-'+res.getDate():'';
    
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
  
        this.receive = ((this.item.QtytoReceive === this.item.QtyOutstanding) && (this.receive === this.item.QtytoReceive))?0: this.receive;
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
    }else if(this.serial === false && this.exp === false && this.lot){
      
      if(this.frm.get('LotNo').value != '' && this.frm.get('QtyBase').value > 0){

        let res = new Date(this.frm.get('requestedDeliveryDate').value);
  
        let fecha = (this.frm.get('requestedDeliveryDate').value != '')?res.getFullYear()+'-'+(res.getMonth()+1)+'-'+res.getDate():'';

      // let res = new Date();
  
       //let fecha = res.getFullYear()+'-'+(res.getMonth()+1)+'-'+res.getDate();
   
    
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
  
        this.receive = ((this.item.QtytoReceive === this.item.QtyOutstanding) && (this.receive === this.item.QtytoReceive))?0: this.receive;
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


}
