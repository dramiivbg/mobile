import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { IonInfiniteScroll, PopoverController } from '@ionic/angular';
import { PopoverLpEmptyComponent } from '@prv/components/popover-lp-empty/popover-lp-empty.component';
import { InterceptService } from '@svc/intercept.service';
import { JsonService } from '@svc/json.service';
import { WmsService } from '@svc/wms.service';

@Component({
  selector: 'app-wms-item-journal',
  templateUrl: './wms-item-journal.page.html',
  styleUrls: ['./wms-item-journal.page.scss'],
})
export class WmsItemJournalPage implements OnInit {



  public boolean:Boolean = false;


  public fechaC:any;
  

  
public frm: FormGroup;

  public company:any = '';
  public PLUNo:any = '';

  public UoM:any = '';

  public qty: any = 0;

  public binCode:any = '';


  public No:any = '';
  public locate:any = '';
  public fecha:any = '';
  public zone:any = '';

  constructor(public router: Router, public popoverController: PopoverController, private intServ: InterceptService, 
    private barcodeScanner: BarcodeScanner, private formBuilder: FormBuilder, private wmsService:WmsService, private js: JsonService) { 


      this.frm = this.formBuilder.group(
        {
          bin: [' ', Validators.required],
          qty: [0, Validators.required],
          ItemNo: [' ', Validators.required],
          lpNo: [' ', Validators.required],
    
        }
      )
    }

  

  ngOnInit() {
  }


  back(){


    this.router.navigate(['page/main/modules']);
  }

 async newLP(ev){



  this.intServ.loadingFunc(true);

    const popover = await this.popoverController.create({
      component: PopoverLpEmptyComponent,
      cssClass: 'popoverLpEmptyComponent',
     backdropDismiss: false
    });
   
    this.intServ.loadingFunc(false);
    
    await popover.present();
    const { data } = await popover.onDidDismiss();

   console.log(data);

    if(data.data != null){
      

      let lpNo = data.data.LPNo;


      let lp  = await this.wmsService.getLpNo(lpNo.toUpperCase());



      let lpH = await this.wmsService.ListLpH(lp);

      if(lpH.fields.PLUZoneCode === 'STO'){
        
      this.company = lpH.company;
      this.qty = lpH.fields.PLULPTotalQuantities;
      this.PLUNo = lpH.fields.PLUItemNo;
      this.UoM = lpH.fields.PLUUnitofMeasure;

      this.locate = lpH.fields.PLULocationCode;

      this.fechaC = lpH.fields.SystemCreatedAt;

      let f  = new  Date(lpH.fields.SystemCreatedAt);

      let fecha = f.getDate()+'/'+(f.getMonth()+1)+'/'+f.getFullYear();

      this.fecha = fecha;


      this.zone = lpH.fields.PLUZoneCode;

      this.binCode = lpH.fields.PLUBinCode;

      

      console.log(lp);


      this.frm.patchValue({

        bin: "",
        qty: 0,
        ItemNo: "",
        lpNo 

      })

    
      this.boolean = true;
      }

    }
  

  }

  add(){

  let qty =  this.frm.get('qty').value;

    qty +=1

    this.frm.get('qty').setValue(qty);

  }

  res(){

    let qty =  this.frm.get('qty').value;

    
 
     qty -=1

     this.frm.get('qty').setValue(qty);
     
  }

  newPallet(){


    console.log('new Pallet');

  }



 async onSubmit(){



    if(this.frm.valid){

      this.intServ.loadingFunc(true);


      let obj = await this.js.formToJson(this.frm);

      try {

        let res = await this.wmsService.WarehouseItemJournal_LP(obj.lpNo,this.zone,this.binCode,this.locate,obj.ItemNo,obj.qty,this.UoM);


        if(res.Error) throw new Error(res.Error.Message);


        let month:any;
        let day:any;
        let date = new Date(this.fechaC);

        if((date.getMonth()+1) < 9) {
          month = '0'+ (date.getMonth()+1)
      }else{
  
        month = (date.getMonth()+1);
      }
  
  
      if(date.getDate() <= 9) {
        day = '0'+ date.getDate();
    }else{
  
      day = date.getDate();
    }
  
  
        let fecha = date.getFullYear() +'-'+month+'-'+day;
  
        console.log(fecha)
  

        let just = await  this.wmsService.CalculateWhseAdjustment(obj.ItemNo,fecha);



        if(just.Error) throw new Error(just.Error.Message);

         this.company = '';
        this.PLUNo = '';
      
        this.UoM = '';
      
        this.qty = 0;
      
        this.binCode = '';
      
      
        this.No = '';
        this.locate = '';
        this.fecha = '';
        this.zone = '';

        this.frm.patchValue({
          bin: "",
          qty:0,
          ItemNo: "", 
          lpNo: "",
          
    
        });
      
        this.intServ.loadingFunc(false);

        this.intServ.alertFunc(this.js.getAlert('success',' ', `Posted No: ${res.Posted}`));

       
        
        
      } catch (error) {

        this.intServ.loadingFunc(false);

        this.intServ.alertFunc(this.js.getAlert('error',' ', error.message));
        
      }

      

     

    }



  }


  onScanBin(){

    
  this.barcodeScanner.scan().then(
    async(barCodeData) => {
      let bin = barCodeData.text.toUpperCase();

      this.intServ.loadingFunc(true);


 try {



this.frm.patchValue({

  bin
});


this.binCode = bin;

this.intServ.loadingFunc(false);



} catch (error) {

  this.intServ.loadingFunc(false);
    this.intServ.alertFunc(this.js.getAlert('error', '', error.message));

}

    }
  ).catch(
    err => {
      console.log(err);
    }
  )


  }


onScanLP(){



  this.barcodeScanner.scan().then(
      async(barCodeData) => {
        let lpNo = barCodeData.text;

        this.intServ.loadingFunc(true);


   try {

  
 
    let res  = await this.wmsService.getLpNo(lpNo.toUpperCase());


    if(res.Error) throw new Error(res.Error.Message);
    



    let lpH = await this.wmsService.ListLpH(res);

    if(lpH.fields.PLULicensePlateStatus !== 'Stored') throw new Error(`The LP ${lpNo.toUpperCase()} is not in Storage`);
    

    let lp = await this.wmsService.ListLp(res);
      
    this.company = lp.company;
    this.qty = lp.fields.PLUQuantity;
    this.PLUNo = lp.fields.PLUNo;
    this.UoM = lp.fields.PLUUnitofMeasureCode;

    this.locate = lp.fields.PLULocationCode;

    this.fechaC = lp.fields.SystemCreatedAt;

    let f  = new  Date(lp.fields.SystemCreatedAt);

    let fecha = f.getDate()+'/'+(f.getMonth()+1)+'/'+f.getFullYear();

    this.fecha = fecha;


    this.zone = lpH.fields.PLUZoneCode;

    this.binCode = lpH.fields.PLUBinCode;

    this.No = lp.fields.PLUWhseDocumentNo;
    this.locate = lpH.fields.PLULocationCode;

    let bin = lpH.fields.PLUBinCode;

    let ItemNo = lp.fields.PLUNo;

    let qty = lp.fields.PLUQuantity;

    console.log(lp);


    this.frm.patchValue({
      bin,
      ItemNo, 
      lpNo,
      

    });

  
    this.boolean = false;
    
    this.intServ.loadingFunc(false);
  
  } catch (error) {

    this.intServ.loadingFunc(false);
      this.intServ.alertFunc(this.js.getAlert('error', '', error.message));
  
  }

      }
    ).catch(
      err => {
        console.log(err);
      }
    )


  }



onScanItem(){



  this.barcodeScanner.scan().then(
      async(barCodeData) => {
        let ItemNo = barCodeData.text;

        this.intServ.loadingFunc(true);


   try {

  
  let res = await this.wmsService.GetItem(ItemNo);

  if(res.Error) throw new Error(res.Error.Message);
  
   let item = await this.wmsService.listItem(res);

   this.company = item.company;
   this.PLUNo = item.fields.No;
   this.UoM = item.fields.BaseUnitofMeasure;

   console.log(item);

  this.frm.patchValue({

    ItemNo
  });


  this.intServ.loadingFunc(false);


  
  } catch (error) {

    this.intServ.loadingFunc(false);
      this.intServ.alertFunc(this.js.getAlert('error', '', error.message));
  
  }

      }
    ).catch(
      err => {
        console.log(err);
      }
    )


  }
}
