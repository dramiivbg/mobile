import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { InterceptService } from '@svc/intercept.service';
import { WmsService } from '@svc/wms.service';


@Component({
  selector: 'app-whitem-reclassification',
  templateUrl: './whitem-reclassification.page.html',
  styleUrls: ['./whitem-reclassification.page.scss'],
})
export class WhitemReclassificationPage implements OnInit {

  public frm: FormGroup;

  public binCode:any = '';

  public lp:any;

  public lpH:any;

  public company:any = '';

  public PLUQuantity:any = 0;

  public PLUNo:any = '';

  public PLUUnitofMeasureCode:any = '';

  public PLUZoneCode:any = '';

  public PLUBinCode:any = '';

  constructor(
    private barcodeScanner: BarcodeScanner,private formBuilder: FormBuilder,private wmsService: WmsService, private intServ: InterceptService

  ) { 

    this.frm = this.formBuilder.group(
      {
        bin: [' ', Validators.required],
        qty: [0, Validators.required],
        lpNo: [' ', Validators.required],
  
      }
    )
  }

  ngOnInit() {
  }


  onScanBin(){


    this.barcodeScanner.scan().then(
      barCodeData => {
        let bin = barCodeData.text.toUpperCase();

        this.binCode = barCodeData.text.toUpperCase();


        this.frm.patchValue({

          bin
        })
    
      }
    ).catch(
      err => {
        console.log(err);
      }
    )



  }


  add(){

    let qty =  this.frm.get('qty').value;
  
      qty +=1
  
      this.frm.get('qty').setValue(qty);
  
    }
  
    res(){
  
      let qty =  this.frm.get('qty').value;
  
      if(qty > 0){
   
       qty -=1
  
       this.frm.get('qty').setValue(qty);
       }
  
    }

  onScanLP(){



    this.barcodeScanner.scan().then(
    async(barCodeData) => {
        let lpNo = barCodeData.text.toUpperCase();

        this.intServ.loadingFunc(true);

        let res = await this.wmsService.getLpNo(lpNo);

        console.log(res);

        this.lp = await this.wmsService.ListLp(res);

        this.company = this.lp.company;

        this.PLUQuantity = this.lp.fields.PLUQuantity;

        this.PLUNo = this.lp.fields.PLUNo;

        this.PLUUnitofMeasureCode = this.lp.fields.PLUUnitofMeasureCode;

        this.lpH = await this.wmsService.ListLpH(res);

        this.PLUZoneCode = this.lpH.fields.PLUZoneCode;


        let f  = new  Date(this.lpH.fields.SystemCreatedAt);

        let fecha = f.getDate()+'/'+(f.getMonth()+1)+'/'+f.getFullYear();
  
        this.lpH.fields.SystemCreatedAt = fecha;

        this.binCode = this.lpH.fields.PLUBinCode;

        this.PLUBinCode = this.lpH.fields.PLUBinCode;

        let qty =  this.lp.fields.PLUQuantity;
        
        this.frm.setValue({

          bin: this.PLUBinCode,
          lpNo,
          qty
        });

       
        this.intServ.loadingFunc(false);



      


      }
    ).catch(
      err => {
        console.log(err);
      }
    )


  }


  onSubmit(){



  }
  
}
