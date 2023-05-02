import { Component, OnInit } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { InterceptService } from '@svc/intercept.service';
import { JsonService } from '@svc/json.service';
import { WmsService } from '@svc/wms.service';
import { iif } from 'rxjs';

@Component({
  selector: 'app-bin-to-bin',
  templateUrl: './bin-to-bin.page.html',
  styleUrls: ['./bin-to-bin.page.scss'],
})
export class BinToBinPage implements OnInit {

  public loading:Boolean = false;

  public lpH:any = undefined;

  public lp:any = undefined;

  public binOrigi:any;
  public scanLP: boolean = true;
  public scanBin: boolean = false;

  public boolean:Boolean = false;

  public listBin:any;

  constructor(private intServ: InterceptService, private barcodeScanner: BarcodeScanner, private js: JsonService, private wmsService: WmsService) { }

 async  ngOnInit() {

  }
  public async onBarCode() {
    this.barcodeScanner.scan().then(
      async(barCodeData) => {
        let code = barCodeData.text;

        this.intServ.loadingFunc(true);
      
        try {
          
          let res = await this.wmsService.getLpNo(code.toUpperCase());

          console.log(res);

          if(res.Error) throw new Error(res.Error.Message);

          if(res.error) throw new Error(res.error.message);
          

         let lp = await this.wmsService.ListLp(res);
         this.lpH = await this.wmsService.ListLpH(res);

         if(this.lpH.fields.PLULicensePlateStatus !== "Stored") throw new Error(`LP ${lp.fields.PLULPDocumentNo} is not in Storage`);
         
         this.lp = lp;


        this.binOrigi =  this.lpH.fields.PLUBinCode; 

         this.boolean = true;

         this.intServ.loadingFunc(false);

         this.listBin = (await this.wmsService.GetBinByLocation(this.lpH.fields.PLULocationCode)).Bins;

         console.log( this.listBin);
         
    this.intServ.alertFunc(this.js.getAlert('confirm', '','Do you want to change it to another Bin code?', () => {

      this.onBarCodeChange();
    }));
    

         console.log('line =>', this.lp);
         console.log('header =>', this.lpH);
          
        } catch (error) {

          this.intServ.loadingFunc(false);

          this.intServ.alertFunc(this.js.getAlert('error', ' ', error.message));
          
        }
        
      }
    ).catch(
      err => {
        console.log(err);
      }
    )



  }

 async onSubmit(){


   this.intServ.loadingFunc(true);

   try {

   let obj = {
      LPNo: this.lpH.fields.PLULPDocumentNo,
      Zone:this.lpH.fields.PLUZoneCode,
      FromBin:this.binOrigi,
      ToBin:this.lpH.fields.PLUBinCode,
      LocationCode:this.lpH.fields.PLULocationCode
      }
    
   let res = await this.wmsService.MoveBinToBinArray_LP([obj]);



    if(res.Error) throw new Error(res.Error.Message);
    
    this.intServ.loadingFunc(false);

    console.log(res);

    this.intServ.alertFunc(this.js.getAlert('success', '', `Posted No: ${res.Posted}`, () => {


      this.lp = undefined;

      this.lpH = undefined;

      let obj = {
        LPNo: " ",
        Zone:"",
        FromBin:"",
        ToBin:"",
        LocationCode:""
        }
  
    
    }));

  
    
   } catch (error) {

    this.intServ.loadingFunc(false);

    this.intServ.alertFunc(this.js.getAlert('error', '', error.message));

    
   }

  }


  onChangeBinOne(item:any,bin:any){

    this.lpH.fields.PLUBinCode = bin;
  }

  public async onBarCodeChange(){

    this.barcodeScanner.scan().then(
      async(barCodeData) => {
        let code = barCodeData.text;

        this.intServ.loadingFunc(true);
      
       let line =   this.listBin.find(bin => bin.BinCode.toUpperCase() === code.toUpperCase())
  
       if(line != undefined){
        this.lpH.fields.PLUBinCode = line.BinCode;
       }else{
        this
        this.intServ.alertFunc(this.js.getAlert('error', '', `Bin Code ${code.toUpperCase()} does not exist`));
       }
    


    this.intServ.loadingFunc(false);
    

      }
    ).catch(
      err => {
        console.log(err);
        this.intServ.loadingFunc(false);
        this.intServ.alertFunc(this.js.getAlert('alert', '','Please scan an LP or item'));

      }
    )


  }


  

}
