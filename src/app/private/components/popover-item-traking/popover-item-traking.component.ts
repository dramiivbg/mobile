import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
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
  public total = 0;
  public Boolean = true;
  public Quantity = 0;
  public receive:number = 0;
  public code:any;
  public list:any[] = [];

  public traking = false;

  public item: any;
  public approved = true;
  public frm: UntypedFormGroup;
  constructor(private formBuilder: UntypedFormBuilder, public popoverController: PopoverController,private barcodeScanner: BarcodeScanner, 
    private jsonService: JsonService,  private intServ: InterceptService, private wmsService: WmsService,  private storage: Storage) {

   
    this.frm = this.formBuilder.group(
      {
        requestedDeliveryDate: ['', Validators.required],
        TotalToReceive: ['', Validators.required],
        SerialNo: ['', Validators.required],
        LotNo: ['', Validators.required],
        QtyBase: ['', Validators.required],



      }
    )
  }

 async ngOnInit() {
  
  this.item = (this.options.item !== null) ? this.options.item : null;
  this.lp = (this.options.lp !== null) ? this.options.lp : null;
 this.trakingOpen =  this.options.trakingOpen;
 this.trakingClose = this.options.trakingClose;

 this.code = this.options.code;
 

  this.serial = (this.code.lines.SNPurchaseInboundTracking === true )?true:false;

     this.lot = (this.code.lines.LotPurchaseInboundTracking == true )?true:false;

     this.exp = (this.code.lines.ManExpirDateEntryReqd == true)?true:false; 

     this.frm.controls['LotNo'].disable();
   
     this.frm.controls['SerialNo'].disable();
  
     this.frm.controls['requestedDeliveryDate'].disable();
 
     this.frm.controls['QtyBase'].disable();
 

   //  this.storage.remove(`${this.item.No} ${this.item.LineNo}`);

   this.receive = this.item.QtytoReceive;

   this.storage.set(`${this.item.No} ${this.item.LineNo}`, this.receive);


    console.log(this.code);
    console.log(this.item);
    console.log('receive',this.receive);

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
          this.approved = true;
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
        let line = this.list.find(x => x.LotNo === code.toUpperCase());
        if(line != undefined){
          this.frm.patchValue({

            LotNo: code.toUpperCase(),
            requestedDeliveryDate: line.ExperationDate
  
          });
          if(this.exp) document.getElementById('datetime').setAttribute('disabled','true');
      

        }else{


         if(this.exp) document.getElementById('datetime').setAttribute('disabled','false');

          this.frm.patchValue({

            LotNo: code.toUpperCase()
  
          });
        }
    
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
  console.log(this.trakingOpen);

  const popover = await this.popoverController.create({
    component: PopoverListSNComponent,
    cssClass: 'popoverListSNComponent-modal',
    componentProps: {list:this.list, item:this.item,checkbox:true},
    
  });
  await popover.present();
  const { data } = await popover.onDidDismiss();

  this.list = data.list;
  this.Quantity = 0;
  this.list.length > 0?this.list.map(x => {if(x.proceded === false){this.Quantity += x.Qty}}):this.Quantity;
    
  }


  async  viewProcessed(){

    let processed = [];

    for (const key in this.trakingOpen) {
  
    let  obj =   {
    
        Qty: 0,
        SerialNo: "",
        LotNo: "",
        ExperationDate: "",
        proceded: true
      }
  
      obj.Qty = this.trakingOpen[key].Quantity;
      obj.SerialNo = this.trakingOpen[key].SerialNo;
      obj.LotNo = this.trakingOpen[key].LotNo;
      obj.ExperationDate = this.trakingOpen[key].ExpirationDate;
  
       processed.push(obj);
    }
  
    console.log(this.trakingOpen);
  
    const popover = await this.popoverController.create({
      component: PopoverListSNComponent,
      cssClass: 'popoverListSNComponent-modal',
      componentProps: {list:processed, item:this.item,checkbox:true},
      
    });

    await popover.present();
    const { data } = await popover.onDidDismiss();     
  
    if(data != undefined){
  
      switch(data.data){
  
        case "Delete":
          let res = await this.wmsService.GetItemTrackingSpecificationV2(this.item.ItemNo,this.item.SourceNo,this.item.SourceLineNo);
          this.trakingOpen = (res.ItemTrackingOpenJO.Error === undefined)?await this.wmsService.listTraking(res.ItemTrackingOpenJO.TrackingSpecificationOpen):[];
          if(this.trakingOpen.length == 0) this.storage.remove(`traking item ${this.item.No}`);
          console.log(this.trakingOpen);
  
          this.receive = await this.storage.set(`${this.item.No} ${this.item.LineNo}`, false);
  
          break;
    
       }
    }
   
    }

 async onSubmit(){
  
  switch(this.Boolean){
    case true:
  
      console.log(this.frm.controls['TotalToReceive'].value, this.lp.LP_Pending_To_Receive);
      if(this.frm.valid && this.frm.controls['TotalToReceive'].value <= this.lp.LP_Pending_To_Receive){
        this.total = this.frm.controls['TotalToReceive'].value;
        this.frm.controls['TotalToReceive'].disable();
       if(this.lot)this.frm.controls['LotNo'].enable();
     
       if(this.serial)this.frm.controls['SerialNo'].enable();
    
       if(this.exp)this.frm.controls['requestedDeliveryDate'].enable();
   
       if(this.serial === false) this.frm.controls['QtyBase'].enable();
  
        this.Boolean = false;
      }else{
        this.intServ.alertFunc(this.jsonService.getAlert('alert', '',`You can't take back more than you have`));
      }  
      break;
    
    default:
    switch(this.Quantity === this.total){
     case true:   
      let line = this.list.find(x => x.proceded === false);
      if(line !== undefined){
       this.intServ.loadingFunc(true);  
       try {

      this.total+= await this.storage.get(`${this.item.No} ${this.item.LineNo}`);
       
       let res =   await this.wmsService.UpdateItemTrackingSpecificationOpenV2(this.item,this.list,this.total);   

        if(res.Error) throw new Error(res.Error.Message);

        if(res.error) throw new Error(res.error.message);
               
         this.receive = await this.storage.get(`${this.item.No} ${this.item.LineNo}`);
        
         this.intServ.loadingFunc(false);
         this.traking = true;
         this.storage.set(`traking item ${this.item.No}`, this.traking);
         this.intServ.alertFunc(this.jsonService.getAlert('success','','The operation was successfully performed',async() => {        
            
           this.popoverController.dismiss({receive: this.total});   
         }));

         
                    
       } catch (error) {
         this.intServ.loadingFunc(false);
         this.intServ.alertFunc(this.jsonService.getAlert('error','',error.message));       
       }
     }   
      break;
    }
  
      break;
  }
  }

  save(){

   switch(this.serial){

   case true:
    let line = this.list.find(x => x.SerialNo === this.frm.get('SerialNo').value.toUpperCase());
    let line2 = this.trakingOpen.find(x => x.SerialNo === this.frm.get('SerialNo').value.toUpperCase());
    let line3 = this.trakingClose.find(x => x.SerialNo === this.frm.get('SerialNo').value.toUpperCase());

    if(line != undefined || line2 != undefined || line3 != undefined){
      this.approved = false;
      this.frm.controls.SerialNo.setValue('');

      this.intServ.alertFunc(this.jsonService.getAlert('alert', '', `The serial ${this.frm.get('SerialNo').value.toUpperCase()} already exists`));

    }else{
      this.approved = true;
    }

      break;

   case false:
       this.approved = true;
    break;
   } 

    
  let Qty = (this.serial)?1:this.frm.get('QtyBase').value;
 
    if(this.approved && this.frm.valid){

     switch(this.Quantity+Qty <= this.total){

      case true:

        let res = new Date(this.frm.get('requestedDeliveryDate').value);
  
        let month = (res.getMonth()+1 < 10)?'0'+(res.getMonth()+1):res.getMonth()+1
  
        let day = (res.getDate() < 10)?'0'+res.getDate():res.getDate();
    
        let fecha = (this.frm.get('requestedDeliveryDate').value.includes(':'))?res.getFullYear()+'-'+month+'-'+day:this.frm.get('requestedDeliveryDate').value;
  
        let obj =   {
          LotNo: "",
          SerialNo: "",
          ExperationDate: "",
          Qty: 0,
          proceded: false
        }
        
        if(this.serial){

          obj.Qty = 1;
          obj.SerialNo = this.frm.get('SerialNo').value.toUpperCase();
          obj.LotNo = this.frm.get('LotNo').value;
          obj.ExperationDate = fecha;

          this.Quantity += obj.Qty;  
          this.list.push(obj);

        }else{
       
          let find = this.list.find(x => x.LotNo === this.frm.get('LotNo').value);
          if(find === undefined){
            obj.Qty = this.frm.get('QtyBase').value;
            obj.SerialNo = this.frm.get('SerialNo').value.toUpperCase();
            obj.LotNo = this.frm.get('LotNo').value;
            obj.ExperationDate = fecha;

            this.Quantity += obj.Qty;
  
            this.list.push(obj);

          }else{
            find.Qty += this.frm.get('QtyBase').value;
            this.Quantity+= this.frm.get('QtyBase').value;
          }        
        }
       
       
  
        this.frm.patchValue({
  
          SerialNo: "",
          LotNo: "",
          requestedDeliveryDate: "",
          QtyBase: ""
        });
  
        console.log(this.list);
        break;
      default:

        this.frm.patchValue({
          SerialNo: "",
          LotNo: "",
          requestedDeliveryDate: "",
          QtyBase: ""
        });

      this.intServ.alertFunc(this.jsonService.getAlert('alert','','You cannot create more than you receive'));

        break;
      }
    }
      
    }

  }



