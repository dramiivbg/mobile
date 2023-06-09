import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { PopoverController } from '@ionic/angular';
import { InterceptService } from '@svc/intercept.service';
import { JsonService } from '@svc/json.service';
import { Storage } from '@ionic/storage';
import { PopoverListSerialLpComponent } from '../popover-list-serial-lp/popover-list-serial-lp.component';
import { PopoverConfigurationCodeComponent } from '../popover-configuration-code/popover-configuration-code.component';
import { PopoverListSNComponent } from '../popover-list-sn/popover-list-sn.component';

@Component({
  selector: 'app-popover-add-item-traking',
  templateUrl: './popover-add-item-traking.component.html',
  styleUrls: ['./popover-add-item-traking.component.scss'],
})
export class PopoverAddItemTrakingComponent implements OnInit {

  @Input() item:any;
  @Input() UoM:any;
  @Input() code:any;
  @Input() palletNo:any;
  @Input() trakingClose:any;
  @Input() trakingOpen:any;
  public mensaje = '';
  public Quantity = 0;
  public total:number;
  public obj:any = {};
  public frm: UntypedFormGroup;
  public frm2: UntypedFormGroup;
  public list:any[] = [];
  public Boolean:boolean = true;
  public lot:boolean = false; 
  public exp:boolean = false;
  public serial:boolean = false;
  public send = false;
  constructor( private formBuilder: UntypedFormBuilder, public popoverController: PopoverController, private barcodeScanner: BarcodeScanner,
    private jsonService: JsonService, private intServ: InterceptService,  private storage: Storage) {

      
  }

  ngOnInit() {

    
    this.frm = this.formBuilder.group(
      {
        TotalToReceive: [this.item.Qty, Validators.required],
       
      }
    )

    let fecha = new Date().toISOString();

    this.frm2 = this.formBuilder.group(
      {
        SerialNo: ['', Validators.required],
        LotNo: ['', Validators.required],
        exp: [fecha, Validators.required],
        Qty: ['', Validators.required]

      }
    ) 

    console.log(this.code);
    this.lot = (this.code.lines.LotPurchaseInboundTracking)?true:false;
    this.serial = (this.code.lines.SNPurchaseInboundTracking)?true:false;
    this.exp = (this.code.lines.ManExpirDateEntryReqd)?true:false;
    this.intServ.loadingFunc(false);
    if(this.lot === false) this.frm2.controls['LotNo'].disable();
   
   if(this.serial === false) this.frm2.controls['SerialNo'].disable();

   if(this.exp === false) this.frm2.controls['exp'].disable();

   if(this.serial) this.frm2.controls['Qty'].disable();

    console.log(this.trakingClose,this.trakingOpen);


     this.obj =  {
      ItemNo: this.item.ItemNo,
      TotalToReceive: this.item.Qty,
      UnitofMeasureCode: this.item.UnitofMeasureCode,
      SourceNo: this.item.SourceNo,
      SourceRefNo: this.item.SourceRefNo,
      LineNo: this.item.LineNo,
      TrackingInfo: []
    }

  

   this.intServ.loadingFunc(false);

  }


  

  public async scanLOT(){

    this.barcodeScanner.scan().then(
      barCodeData => {
        let code = barCodeData.text;
  
        console.log(code);

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

  let obj = await this.jsonService.formToJson(this.frm2); 

  let fecha2 = new Date().toISOString();

let Qty = (this.serial)?1:obj.Qty;
 
    if(this.Quantity+Qty === this.total)this.send = true
        if (this.frm2.valid) {    
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
              proceded: false
            }
            let  json2 =   {
              LotNo: obj.LotNo,
              SerialNo: obj.SerialNo.toUpperCase(),
              ExperationDate: fecha,
              Qty: 1
            }
      
            this.list.push(json);
            this.obj.TotalToReceive = this.total;
            this.obj.TrackingInfo.push(json2);
      
      
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
      
            json2 =   {
              LotNo: "",
              SerialNo: "",
              ExperationDate: "",
              Qty: 0,
      
            }
          }else{
    
           let line = this.list.find(x => x.LotNo === obj.LotNo);
    
           switch(line){
    
            case undefined:
              let  json =   {
                LotNo: obj.LotNo,
                SerialNo: obj.SerialNo.toUpperCase(),
                ExperationDate: fecha,
                Qty: (obj.Qty > 1)?obj.Qty:1,
                proceded: false
              }
              let  json2 =   {
                LotNo: obj.LotNo,
                SerialNo: obj.SerialNo.toUpperCase(),
                ExperationDate: fecha,
                Qty: (obj.Qty > 1)?obj.Qty:1
              }
        
              this.list.push(json);
              this.obj.TotalToReceive = this.total;
              this.obj.TrackingInfo.push(json2);
        
        
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
        
              json2 =   {
                LotNo: "",
                SerialNo: "",
                ExperationDate: "",
                Qty: 0,
        
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
          
           }
    
          }

        document.getElementById('button').setAttribute('disabled','false');
    
        }
  
  }

  public async closePopover() {
    
 this.popoverController.dismiss({obj:undefined});  
   
  }

 async scanSN(){

  this.barcodeScanner.scan().then(
    barCodeData => {
      let code = barCodeData.text;

      let line = this.list.find(x => x.SerialNo === code.toUpperCase());
      let line2 = this.trakingOpen.find(x => x.SerialNo === code.toUpperCase());
      let line3  = this.trakingClose.find(x => x.SerialNo === code.toUpperCase());

      if((line === null || line === undefined) && (line2 === null || line2 === undefined) && (line3 === null || line3 === undefined)){
    
        this.frm2.patchValue({
          SerialNo: code.toUpperCase()
        });

      }else{

        this.mensaje = `The serial ${code.toUpperCase()} already exists`;
        this.frm2.controls.SerialNo.setValue("");
      }
      
    }
  ).catch(
    err => {
      console.log(err);
    }
  )

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

          if(this.exp) document.getElementById('button').setAttribute('disabled','true');
          

        }else{

            if(this.exp) document.getElementById('button').setAttribute('disabled','false');
         
            this.frm2.patchValue({
  
              LotNo: val.toUpperCase()
    
            });
          

        }

  }

async  onSubmit(){

    switch(this.Boolean){

      case true:
        if(this.frm.valid){

          let obj = await this.jsonService.formToJson(this.frm);

          this.total = obj.TotalToReceive;
          this.Boolean = false;
        }

        break;

      case false:

        if(this.Quantity === this.total){

          this.popoverController.dismiss({obj:this.obj});
        }

        break;
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

    validSerial(e){
      let val = e.target.value;
      let line = this.list.find(x => x.SerialNo === val.toUpperCase());
      let line2 = this.trakingOpen.find(x => x.SerialNo === val.toUpperCase());
      let line3 = this.trakingClose.find(x => x.SerialNo === val.toUpperCase());
  
      if((line === null || line === undefined) && (line2 === null || line2 === undefined) && (line3 === null || line3 === undefined)){
  
        this.frm2.patchValue({
          SerialNo: val.toUpperCase()
        });
  
  
      }else{
  
        this.intServ.alertFunc(this.jsonService.getAlert('alert','',`The serial ${val.toUpperCase()} already exists`));
        this.frm2.controls.SerialNo.setValue("");
      }
    }
  
    async lists(){

      const popover = await this.popoverController.create({
        component: PopoverListSNComponent,
        cssClass: 'popoverListSNComponent-modal',
        componentProps: {list:this.list,item:this.item,checkbox:true},
        backdropDismiss: false
        
      });
      await popover.present();
      const { data } = await popover.onDidDismiss();

       this.list = data.list;
       this.obj.TrackingInfo = [];
       data.list.map(x => {if(x.proceded === false)this.obj.TrackingInfo.push(x)});
       this.Quantity = 0;
       this.list.map(x => this.Quantity+= x.Qty);

       this.send = this.Quantity < this.total?false:true;
   
    }
}
