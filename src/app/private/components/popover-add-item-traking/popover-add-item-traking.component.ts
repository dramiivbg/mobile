import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { PopoverController } from '@ionic/angular';
import { InterceptService } from '@svc/intercept.service';
import { JsonService } from '@svc/json.service';
import { Storage } from '@ionic/storage';
import { PopoverListSerialLpComponent } from '../popover-list-serial-lp/popover-list-serial-lp.component';

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
  public total:number;
  public obj:any = {};
  public frm: FormGroup;
  public frm2: FormGroup;
  public list:any[] = [];
  public Boolean:boolean = true;
  public lot:boolean = false; 
  public exp:boolean = false;
  public serial:boolean = false;
  constructor( private formBuilder: FormBuilder, public popoverController: PopoverController, private barcodeScanner: BarcodeScanner,
    private jsonService: JsonService, private intServ: InterceptService,  private storage: Storage) { 

    this.frm = this.formBuilder.group(
      {
        TotalToReceive: ['0', Validators.required],
       
      }
    )

    this.frm2 = this.formBuilder.group(
      {
        SerialNo: ['', Validators.required],
        LotNo: ['', Validators.required],
        exp: ['', Validators.required]


      }
    )
  }

  ngOnInit() {

     this.obj =  {
      WarhouseReceiptNo: this.item.No,
      LP_Pallet_No: this.palletNo,
      Item_Child_No: this.item.ItemNo,
      BinCode: this.item.BinCode,
      SourceNo: this.item.SourceNo,
      SourceRefNo: this.item.SourceRefNo,
      LineNo: this.item.LineNo,
      UnitofMeasureCode: this.item.UnitofMeasureCode,
      Qty: this.item.Qty,
      TrackingInfo: []
    }

    console.log(this.code);
    this.lot = (this.code.lines.LotPurchaseInboundTracking)?true:false;
    this.serial = (this.code.lines.SNPurchaseInboundTracking)?true:false;
    this.exp = (this.code.lines.ManExpirDateEntryReqd)?true:false;
    this.intServ.loadingFunc(false);
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

          document.getElementById('datetime').setAttribute('disabled','true');

        }else{


          document.getElementById('datetime').setAttribute('disabled','false');

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

    if (this.frm2.valid) {

      let obj = await this.jsonService.formToJson(this.frm2);

      let res = new Date(obj.exp);

      let month = (res.getMonth()+1 < 10)?'0'+(res.getMonth()+1):res.getMonth()+1

      let day = (res.getDate() < 10)?'0'+res.getDate():res.getDate();
  
      let fecha = (obj.exp.includes(':'))?res.getFullYear()+'-'+month+'-'+day:obj.exp;

     let  json =   {
        LotNo: obj.LotNo,
        SerialNo: obj.SerialNo,
        ExperationDate: fecha,
        Qty: 1,
        proceded: false
      }
      let  json2 =   {
        LotNo: obj.LotNo,
        SerialNo: obj.SerialNo,
        ExperationDate: fecha,
        Qty: 1,
      }

      this.list.push(json);
      this.obj.Qty = this.total;
      this.obj.TrackingInfo.push(json2);



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
        proceded: false
      }

      json2 =   {
        LotNo: "",
        SerialNo: "",
        ExperationDate: "",
        Qty: 0,

      }
    }

  }

  public async closePopover() {
    if(this.list.length > 0){

      this.intServ.alertFunc(this.jsonService.getAlert('confirm','', 'Are you sure?' , () => {

        this.popoverController.dismiss({obj:undefined});
      }));
    }else{
      this.popoverController.dismiss({obj:undefined});
    }
   
  }

 async scanSN(){

  this.barcodeScanner.scan().then(
    barCodeData => {
      let code = barCodeData.text;

      let line = this.list.find(x => x.SerialNo === code.toUpperCase());

      if(line === null || line === undefined){

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

        if(this.list.length === this.total){

          this.popoverController.dismiss({obj:this.obj});
        }

        break;
    }
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
