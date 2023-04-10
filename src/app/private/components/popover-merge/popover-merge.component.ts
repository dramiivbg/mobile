import { Component, Input, OnInit } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { PopoverController } from '@ionic/angular';
import { InterceptService } from '@svc/intercept.service';
import { JsonService } from '@svc/json.service';
import { WmsService } from '@svc/wms.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-popover-merge',
  templateUrl: './popover-merge.component.html',
  styleUrls: ['./popover-merge.component.scss'],
})
export class PopoverMergeComponent implements OnInit {

  public lpNo:any = '';

  public boolean:Boolean = true;

  public loading:Boolean = false;

  public mensaje  = '';

  public type = '';

  public color = '';

  @Input() lp:any;
  constructor(private popoverController: PopoverController,  private barcodeScanner: BarcodeScanner, private wmsService: WmsService,
    ) { }

  ngOnInit() {}


  onFilter(e, lp:any = ''){


    if(lp ===''){


      console.log(e.target.value);

    }else{

      console.log(lp);
    }
   
  }


  public async closePopover() {
    this.popoverController.dismiss({});
  }


  autoComplet(){


       
    this.barcodeScanner.scan().then(
      async  (barCodeData) => {
          let code = barCodeData.text;
   
          try {

            let res = await this.wmsService.getLpNo(code.toUpperCase());

            if(res.Error) throw new Error(res.Error.Message);
            if(res.error) throw new Error(res.error.message);
              
              let lp = await this.wmsService.ListLp(res);
              let lpH = await this.wmsService.ListLpH(res);
    
    
              console.log(lp);
    
              if(lpH.fields.PLULicensePlateStatus === "Stored" ){
    
                if(lp.fields.PLULPDocumentType === "Single" ){
    
                  this.lpNo = code.toUpperCase();
     
    
                  this.onFilter('', this.lpNo);
    
                
                }else{
    
                  this.type = 'warning';
                  this.color = 'warning';
                    this.mensaje =  `The license plate ${code.toUpperCase()} is not a single`
                 
    
                }
            
              
    
              }else{
                   
                  this.type = 'warning';
                  this.color = 'warning';
                  this.mensaje =  `The license plate ${code.toUpperCase()} is not in storage`;
                
              }
            
          } catch (error) {

            this.type = "close";
            this.color = "danger";
              this.mensaje =  error.message;
            
          }
      
        }
      ).catch(
        err => {
          console.log(err);
        }
      )


  }

 async onSubmit(){

  if(this.lpNo != ''){
    this.popoverController.dismiss({lpNo:this.lpNo});
  }

  }


}
