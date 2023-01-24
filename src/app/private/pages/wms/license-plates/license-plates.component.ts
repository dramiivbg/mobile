import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
  public frm: FormGroup;
  public frm2: FormGroup;
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
  @Input() options: any = {};

  constructor(private intServ: InterceptService
    , private formBuilder: FormBuilder
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
    )

    this.frm2 = this.formBuilder.group(
      {
        SerialNo: ['', Validators.required],
        LotNo: ['', Validators.required],
        exp: ['', Validators.required],
        Qty: ['', Validators.required]


      }
    )
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
    
    if(this.code != null){
      this.lot = (this.code.lines.LotPurchaseInboundTracking)?true:false;
      this.serial = (this.code.lines.SNPurchaseInboundTracking)?true:false;
      this.exp = (this.code.lines.ManExpirDateEntryReqd)?true:false;
    }

    this.storage.remove(`lists ${this.item.LineNo}`);
    this.storage.remove(`Qty ${this.item.LineNo}`);

    this.list = (await this.storage.get(`lists ${this.item.LineNo}`) != null || await this.storage.get(`lists ${this.item.LineNo}`) != undefined)?await this.storage.get(`lists ${this.item.LineNo}`):[];

    this.Quantity = (await this.storage.get(`Qty ${this.item.LineNo}`) != null || await this.storage.get(`Qty ${this.item.LineNo}`) != undefined)?await this.storage.get(`Qty ${this.item.LineNo}`):0;
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
    switch(this.item.trakingCode){

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


    if(this.frm.valid && this.Boolean){

      this.total =  obj.TotalToReceive * obj.NoofPackLP;
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

           this.storage.remove(`lists ${this.item.LineNo}`);
           this.storage.remove(`Qty ${this.item.LineNo}`);
           this.popoverController.dismiss({ data: 'creado' });

         
       } catch (error) {
         
         this.interceptService.loadingFunc(false);
           this.interceptService.alertFunc(this.jsonService.getAlert('error', ' ', error.message));
       }
              
  
    }

    break;

    }
     
    
  }


  public async scanLOT(){

    this.barcodeScanner.scan().then(
      barCodeData => {
        let code = barCodeData.text;
  
        let line = this.list.find(x => x.LotNo === code.toUpperCase());
        if(line != undefined){
          this.frm2.patchValue({

            LotNo: code.toUpperCase(),
            exp: line.ExperationDate
  
          });
          if(this.exp) document.getElementById('datetime').setAttribute('disabled','true');
      

        }else{


         if(this.exp) document.getElementById('datetime').setAttribute('disabled','false');

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

  switch(this.Quantity === this.total){
    case false:
      if (this.frm2.valid) {

        let obj = await this.jsonService.formToJson(this.frm2);
  
        let res = new Date(obj.exp);
  
        let month = (res.getMonth()+1 < 10)?'0'+(res.getMonth()+1):res.getMonth()+1
  
        let day = (res.getDate() < 10)?'0'+res.getDate():res.getDate();
    
        let fecha = (obj.exp.includes(':'))?res.getFullYear()+'-'+month+'-'+day:obj.exp;
  
   if(this.serial){
        
     let  json =   {
        LotNo: obj.LotNo,
        SerialNo: obj.SerialNo,
        ExperationDate: fecha,
        Qty: 1,
        proceded:false
      }

      this.Quantity += json.Qty;
      
      this.list.push(json);

      this.storage.set(`lists ${this.item.LineNo}` ,this.list);
      this.storage.set(`Qty ${this.item.LineNo}`, this.Quantity);

      console.log(this.list);

      this.frm2.patchValue({

        SerialNo: "",
        LotNo: "",
        exp: ""
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
              SerialNo: obj.SerialNo,
              ExperationDate: fecha,
              Qty: obj.Qty,
              proceded: false
            }
                 
          this.list.push(json);
          this.storage.set(`lists ${this.item.LineNo}` ,this.list);
            this.Quantity += json.Qty;
           this.storage.set(`Qty ${this.item.LineNo}`, this.Quantity);
            console.log(this.list);
      
            this.frm2.patchValue({
      
              SerialNo: "",
              LotNo: "",
              exp: "",
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
          this.storage.set(`lists ${this.item.LineNo}` ,this.list);
          this.storage.set(`Qty ${this.item.LineNo}`, this.Quantity);
          this.frm2.patchValue({
      
            SerialNo: "",
            LotNo: "",
            exp: "",
            Qty: ""
          });
        
         }
  
        }
  
      }
      break

     default:
      this.intServ.alertFunc(this.jsonService.getAlert('alert','','You cannot create more than you receive'));
      break;
    
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

  
    async lists(){

      const popover = await this.popoverController.create({
        component: PopoverListSerialLpComponent,
        cssClass: 'popoverListSerialLpComponent-modal',
        componentProps: {list:this.list},
        backdropDismiss: false
        
      });
      await popover.present();
      const { data } = await popover.onDidDismiss();

       this.list = data.list;

      this.storage.set(`lists ${this.item.LineNo}` ,this.list);

   
    }

}
