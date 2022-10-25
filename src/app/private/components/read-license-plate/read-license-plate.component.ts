import { Component, OnInit } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { InterceptService } from '@svc/intercept.service';
import { JsonService } from '@svc/json.service';
import { WmsService } from '@svc/wms.service';

@Component({
  selector: 'app-read-license-plate',
  templateUrl: './read-license-plate.component.html',
  styleUrls: ['./read-license-plate.component.scss'],
})
export class ReadLicensePlateComponent implements OnInit {


  public lp:any = undefined;
  constructor(private barcodeScanner: BarcodeScanner,  private intServ: InterceptService, private wmsService: WmsService,
    private js: JsonService ) { }

  ngOnInit() {}


  onBarCode(){


    let lp;
    this.barcodeScanner.scan().then(
      async(barCodeData) => {
        let No = barCodeData.text;

        this.intServ.loadingFunc(true);

        try {

           lp = await this.wmsService.getLpNo(No.toUpperCase());


          if(lp.Error) throw Error(lp.Error.Message);


          let lpH = await this.wmsService.ListLpH(lp);
          this.lp = await this.wmsService.ListLp(lp);

          this.lp.fields.PLUBinCode = lpH.fields.PLUBinCode;
          this.lp.fields.PLUZoneCode = lpH.fields.PLUZoneCode;
          this.lp.fields.PLULocationCode = lpH.fields.PLULocationCode;

          this.lp.fields.PLUReferenceDocument =  lpH.fields.PLUReferenceDocument

          
          

          console.log(this.lp);

          this.intServ.loadingFunc(false);
          
        } catch (error) {

          this.intServ.loadingFunc(false);

          this.intServ.alertFunc(this.js.getAlert('error',lp.Error.Code , error.message));
          
        }
      
        
      }
    ).catch(
      err => {
        console.log(err);
      }
    )


  }

}
