import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, FormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { PickerController, PopoverController } from '@ionic/angular';
import { InterceptService } from '@svc/intercept.service';
import { JsonService } from '@svc/json.service';
import { SyncerpService } from '@svc/syncerp.service';
import { WmsService } from '@svc/wms.service';
import { GeneralService } from '@svc/general.service';
import { Router } from '@angular/router';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { PopoverListSerialLpComponent } from '@prv/components/popover-list-serial-lp/popover-list-serial-lp.component';
import { Storage } from '@ionic/storage';
import { PopoverConfigurationCodeComponent } from '@prv/components/popover-configuration-code/popover-configuration-code.component';

@Component({
  selector: 'app-license-plates',
  templateUrl: './license-plates.component.html',
  styleUrls: ['./license-plates.component.scss'],
})
export class LicensePlatesComponent implements OnInit {
  public item: any = {};
  public lp: any = {};
  public lstUoM: any = [];
  public frm: UntypedFormGroup;
  public frm2: UntypedFormGroup;
  public code:any = {};
  public trakingClose:any;
  public trakingOpen:any;
  public list:any[] = [];
  public lot:boolean = false; 
  public exp:boolean = false;
  public serial:boolean = false;
  public boolean:boolean = false;
  public Boolean:boolean = true;
  public total:number = 0;
  public Quantity = 0;
  public approved = false;
  public send = false;
  @Input() options: any = {};

  constructor(private intServ: InterceptService
    , private formBuilder: UntypedFormBuilder
    , private jsonService: JsonService
    , private wmsService: WmsService
    , private popoverController: PopoverController
    , private interceptService: InterceptService,
    private router: Router,
    private barcodeScanner: BarcodeScanner,
    private pickerCtrl: PickerController,
    private storage: Storage

  ) {

    let objFunc = {
      func: () => {
        this.onBack();
      }

    };

    this.intServ.appBackFunc(objFunc);

    this.frm = this.formBuilder.group(
      {
        TotalToReceive: ['', Validators.required],
        NoofPackLP: ['', Validators.required],
        PackUnitUoM: ['', Validators.required],
       
      }
    );

    let fecha = new Date().toISOString();

    console.log(fecha);

    this.frm2 = this.formBuilder.group(
      {
        SerialNo: ['', Validators.required],
        LotNo: ['', Validators.required],
        exp: [fecha, Validators.required],
        Qty: ['', Validators.required]


      }
    )
  }

  change(exp){

    console.log(exp);

    this.frm2.controls.exp.setValue(exp);

  }
  public async ngOnInit() {
    this.item = this.options.item === undefined ? {} : this.options.item;
    this.lp = this.options.lp === undefined ? {} : this.options.lp;
    var lstUnitofMeasure = this.options.lstUoM === undefined ? {} : this.options.lstUoM;
    this.lstUoM = lstUnitofMeasure.UnitOfMeasure === undefined ? {} : lstUnitofMeasure.UnitOfMeasure;
    this.code = this.options.code;
    this.trakingClose = this.options.trakingClose;
    this.trakingOpen = this.options.trakingOpen;

    console.log(this.code);

    console.log('trakingOpen => ', this.trakingOpen);
    console.log('trakingClose => ', this.trakingClose);
    
    if(this.code != null){
      this.lot = (this.code.lines.LotPurchaseInboundTracking)?true:false;
      this.serial = (this.code.lines.SNPurchaseInboundTracking)?true:false;
      this.exp = (this.code.lines.ManExpirDateEntryReqd)?true:false;
    }


    if(this.lot === false) this.frm2.controls['LotNo'].disable();
   
    if(this.serial === false) this.frm2.controls['SerialNo'].disable();
 
    if(this.exp === false) this.frm2.controls['exp'].disable();

    if(this.serial) this.frm2.controls['Qty'].disable();
 
  }

  onBack() {
    this.router.navigate(['page/wms/wmsMain']);
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

public async onSubmit() {    

    console.log(this.frm);

    let obj = await this.jsonService.formToJson(this.frm);
    switch(this.code){

    case null:
      if (this.frm.valid) {
        let list = [];
      this.interceptService.loadingFunc(true);

      let json =    {
        No: this.item.No,
        ItemNo: this.item.ItemNo,
        BinCode: this.item.BinCode,
        UnitofMeasureCode: this.item.UnitofMeasureCode,
        TotalToReceive: obj.TotalToReceive * obj.NoofPackLP,
        NoofPackLP: obj.NoofPackLP,
        PackUnitUoM: obj.PackUnitUoM,
        LineNo: this.item.LineNo,
        
      }

      list.push(json);

      if (obj.TotalToReceive == 0) throw new Error('Please put how many license plate you want');      

      if (obj.NoofPackLP == 0) throw new Error('Please put how many packs each license plate will have');


      try {

        let rsl = await this.wmsService.CreateLP_FromWarehouseReceiptLine(list);

          console.log(rsl);

          if (rsl.Error) throw new Error(rsl.Error.Message);
          if (rsl.error) throw new Error(rsl.error.message);
          if (rsl.message) throw new Error(rsl.message);

            this.interceptService.loadingFunc(false);

            this.interceptService.alertFunc(this.jsonService.getAlert('success', ' ', 'License plates have been created successfully'));

            this.popoverController.dismiss({ data: 'creado' });
            
        } catch (error) {  
          this.interceptService.loadingFunc(false);
          this.interceptService.alertFunc(this.jsonService.getAlert('error', ' ', error.message));
            
          }
          
      }  
      
      break;
      
    default:


  
  switch(obj.TotalToReceive * obj.NoofPackLP <= this.lp.LP_Pending_To_Receive){
    case true:
      if(this.frm.valid && this.Boolean){

        this.total =  obj.TotalToReceive * obj.NoofPackLP;
        this.storage.set(`total ${this.item.LineNo}`, this.total);
         this.Boolean = false;
      }
  
      if(this.Boolean === false && this.Quantity === this.total){
  
        this.interceptService.loadingFunc(true);
   
        let listTraking = [];
        for (const key in this.list) {
   
          if(this.list[key].proceded === false){
  
            
         let j =   {
          LotNo: this.list[key].LotNo,
          SerialNo: this.list[key].SerialNo,
          ExperationDate: this.list[key].ExperationDate,
          Qty:this.list[key].Qty
        }
  
        listTraking.push(j);
  
         j =   {
          LotNo: '',
          SerialNo: '',
          ExperationDate: '',
          Qty: 0
        }
  
          }
   
        }
   
      let json2 = {
         WarhouseReceiptNo: this.item.No,
         ItemNo: this.item.ItemNo,
         BinCode: this.item.BinCode,
         SourceNo: this.item.SourceNo,
         SourceRefNo: this.item.SourceLineNo,
         LineNo: this.item.LineNo,
         UnitofMeasureCode: this.item.UnitofMeasureCode,
         TotalToReceive: obj.TotalToReceive * obj.NoofPackLP,
         PackUnitUoM: obj.PackUnitUoM,
         TrackingInfo: listTraking
       }
  
       
         try {
  
           let rsl = await this.wmsService.CreateLP_FromWarehouseReceiptLine_With_SNLOT([json2]);
  
           console.log(rsl);
   
           if (rsl.Error) throw new Error(rsl.Error.Message);
           if (rsl.error) throw new Error(rsl.error.message);
           if (rsl.message) throw new Error(rsl.message);
         
             this.interceptService.loadingFunc(false);
   
             this.interceptService.alertFunc(this.jsonService.getAlert('success', ' ', 'License plates have been created successfully'));
  
        
             this.popoverController.dismiss({ data: 'creado' });
  
           
         } catch (error) {
           
           this.interceptService.loadingFunc(false);
             this.interceptService.alertFunc(this.jsonService.getAlert('error', ' ', error.message));
         }
                
    
      }
      break;

    default:

    this.intServ.alertFunc(this.jsonService.getAlert('alert', '',`You can't take back more than you have`));

      break;
  }
    

    break;

    }
     
    
  }



  public async scanLOT(){

    this.barcodeScanner.scan().then(
      barCodeData => {
        let code = barCodeData.text;
  
        let line = this.list.find(x => x.LotNo === code.toUpperCase());
        let line2 = this.trakingOpen.find(x => x.LotNo === code.toUpperCase());
        let line3  = this.trakingClose.find(x => x.LotNo === code.toUpperCase());
  

        if(line != undefined || line2 != undefined || line3 != undefined){

          this.frm2.patchValue({

            LotNo: code.toUpperCase(),
            exp: line != undefined?line.ExperationDate:line2 != undefined?line2.ExpirationDate:line3.ExpirationDate
  
          });
          if(this.exp) document.getElementById('button').setAttribute('disabled','true');
      

        }else{


         if(this.exp) document.getElementById('button').setAttribute('disabled','false');

          this.frm2.patchValue({

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

 
  

async  save(){
  console.log(this.frm2);
  let obj = await this.jsonService.formToJson(this.frm2);
  let fecha2 = new Date().toISOString();
  console.log(obj);

  let Qty = (this.serial)?1:obj.Qty;

if(this.frm2.valid){

     if(this.Quantity+Qty === this.total)this.send = true;

        let res = new Date(obj.exp);
  
        let month = (res.getMonth()+1 < 10)?'0'+(res.getMonth()+1):res.getMonth()+1
  
        let day = (res.getDate() < 10)?'0'+res.getDate():res.getDate();
    
        let fecha = (obj.exp.includes(':'))?res.getFullYear()+'-'+month+'-'+day:obj.exp;
  
   if(this.serial){
        
     let  json =   {
        LotNo: obj.LotNo,
        SerialNo: obj.SerialNo.toUpperCase(),
        ExperationDate: fecha,
        Qty: 1,
        proceded:false
      }

      this.Quantity += json.Qty;
      
      this.list.push(json);


      console.log(this.list);

      this.frm2.patchValue({

        SerialNo: "",
        LotNo: "",
        exp: fecha2
      });

      json =   {
        LotNo: "",
        SerialNo: "",
        ExperationDate: "",
        Qty: 0,
        proceded:false
      }
    

    }else{
  
         let line = this.list.find(x => x.LotNo === obj.LotNo);
  
         switch(line){
  
          case undefined:
            let  json =   {
              LotNo: obj.LotNo,
              SerialNo: obj.SerialNo.toUpperCase(),
              ExperationDate: fecha,
              Qty: obj.Qty,
              proceded: false
            }
                 
          this.list.push(json);

            this.Quantity += json.Qty;
 
            console.log(this.list);
      
            this.frm2.patchValue({
      
              SerialNo: "",
              LotNo: "",
              exp: fecha2,
              Qty:""
            });
      
            json =   {
              LotNo: "",
              SerialNo: "",
              ExperationDate: "",
              Qty: 0,
              proceded: false
            }
      
            break;
  
          default:
  
          line.Qty += obj.Qty;
          this.Quantity += obj.Qty; 

          this.frm2.patchValue({
      
            SerialNo: "",
            LotNo: "",
            exp: fecha2,
            Qty: ""
          });
          break;
        
         }
  
        }
        document.getElementById('button').setAttribute('disabled','false');
}  
  

  }

  public async closePopover() {
    this.popoverController.dismiss({});
  }

 async scanSN(){

  this.barcodeScanner.scan().then(
    barCodeData => {
      let code = barCodeData.text;

      let line = this.list.find(x => x.SerialNo === code.toUpperCase());
      let line2 = this.trakingOpen.find(x => x.SerialNo === code.toUpperCase());
      let line3 = this.trakingClose.find(x => x.SerialNo === code.toUpperCase());

      if((line === null || line === undefined) && (line2 === null || line2 === undefined) && (line3 === null || line3 === undefined)){

        this.frm2.patchValue({
          SerialNo: code.toUpperCase()
        });

        this.approved = true;
      }else{

        this.intServ.alertFunc(this.jsonService.getAlert('alert','',`The serial ${code.toUpperCase()} already exists`));
      }
      
    }
  ).catch(
    err => {
      console.log(err);
    }
  )

  }

  validSerial(e){
    let val = e.target.value;
    let line = this.list.find(x => x.SerialNo === val.toUpperCase());
    let line2 = this.trakingOpen.find(x => x.SerialNo === val.toUpperCase());
    let line3 = this.trakingClose.find(x => x.SerialNo === val.toUpperCase());

    if((line === null || line === undefined) && (line2 === null || line2 === undefined) && (line3 === null || line3 === undefined)){

      this.frm2.patchValue({
        SerialNo: val.toUpperCase()
      });

      this.approved = true;
    }else{

      this.intServ.alertFunc(this.jsonService.getAlert('alert','',`The serial ${val.toUpperCase()} already exists`));
      this.frm2.controls.SerialNo.setValue("");
    }
  }


  validLot(e){

    let val = e.target.value;

    let line = this.list.find(x => x.LotNo === val.toUpperCase());
     let line2 = this.trakingOpen.find(x => x.LotNo === val.toUpperCase());
     let line3  = this.trakingClose.find(x => x.LotNo === val.toUpperCase());


     if(line != undefined || line2 != undefined || line3 != undefined){

       this.frm2.patchValue({
         LotNo: val.toUpperCase(),
         exp: line != undefined?line.ExperationDate:line2 != undefined?line2.ExpirationDate:line3.ExpirationDate

       });

       console.log(this.frm2);
       

       if(this.exp) document.getElementById('button').setAttribute('disabled','true');
       

     }else{

         if(this.exp) document.getElementById('button').setAttribute('disabled','false');
      
         this.frm2.patchValue({

           LotNo: val.toUpperCase()
 
         });
       

     }

}

  
    async lists(){

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
      
          let line = this.list.find(x => x.SerialNo === obj.SerialNo);
      
          if(line === undefined || line === null)this.list.push(obj);
        }
    
      const popover = await this.popoverController.create({
        component: PopoverListSerialLpComponent,
        cssClass: 'popoverListSerialLpComponent-modal',
        componentProps: {list:this.list},
        backdropDismiss: false
        
      });
      await popover.present();
      const { data } = await popover.onDidDismiss();

       this.list = data.list;
       this.Quantity = 0;

       this.list.length > 0?this.list.map(x => {if(x.proceded === false){this.Quantity += x.Qty}}):this.Quantity;
    
      this.send = this.Quantity < this.total?false:true;
   
    }

}
