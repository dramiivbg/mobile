import { Component, OnInit } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { InterceptService } from '@svc/intercept.service';
import { JsonService } from '@svc/json.service';
import { WmsService } from '@svc/wms.service';

@Component({
  selector: 'app-bin-to-bin',
  templateUrl: './bin-to-bin.page.html',
  styleUrls: ['./bin-to-bin.page.scss'],
})
export class BinToBinPage implements OnInit {

  public loading:Boolean = false;

  public lpH:any = undefined;

  public lp:any = undefined;

  public scanLP: boolean = true;
  public scanBin: boolean = false;

  public boolean:Boolean = false;

  public listBin:any[] = [];

  constructor(private intServ: InterceptService, private barcodeScanner: BarcodeScanner, private js: JsonService, private wmsService: WmsService) { }

  ngOnInit() {


  }

  

  back(){


         
    this.scanLP = true;
    this.scanBin = false;


    
  }

  public onBarCode() {
    this.barcodeScanner.scan().then(
      async(barCodeData) => {
        let code = barCodeData.text;

        this.intServ.loadingFunc(true);
      
        try {
          
          let res = await this.wmsService.getLpNo(code.toUpperCase());

          console.log(res);

          if(res.Error) throw new Error(res.Error.Message);

         let lp = await this.wmsService.ListLp(res);

         if(lp.fields.PLULicensePlateStatus !== "Stored") throw new Error(`LP ${lp.fields.PLULPDocumentNo} is not in Storage`);
         
         this.lp = lp;

         this.lpH = await this.wmsService.ListLpH(res);

         this.boolean = true;

         this.intServ.loadingFunc(false);

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

  switch(this.scanLP){

    case true:

      this.scanLP = false;
      this.loading = true;
      
      let bins = await this.wmsService.GetPossiblesBinFromPutAway(this.lp.fields.PLULPDocumentNo);

      this.listBin.push(bins);

      console.log(this.listBin);

      this.loading = false;
      this.scanBin = true;


   case false:
    
     
  }

  }


  onChangeBinOne(item:any,bin:any){



  }

  public async onBarCodeChange(){

    this.barcodeScanner.scan().then(
      async(barCodeData) => {
        let code = barCodeData.text;

        this.intServ.loadingFunc(true);
      
       let line =   this.listBin[0].Bins.find(bin => bin.BinCode.toUpperCase() === code.toUpperCase())
  

    console.log(this.listBin);

      }
    ).catch(
      err => {
        console.log(err);
      }
    )


  }


  

}
