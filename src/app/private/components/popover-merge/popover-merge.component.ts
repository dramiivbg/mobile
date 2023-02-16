import { Component, Input, OnInit } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { PopoverController } from '@ionic/angular';
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

  @Input() lp:any;
  constructor(private popoverController: PopoverController,  private barcodeScanner: BarcodeScanner, private wmsService: WmsService) { }

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
    

          this.boolean = false;
          this.loading = true;
          let res = await this.wmsService.getLpNo(code.toUpperCase());

        if(!res.Error){

          let lp = await this.wmsService.ListLp(res);


          console.log(lp);

          if(lp.fields.PLULicensePlateStatus === "Stored" ){

            if(lp.fields.PLULPDocumentType === "Single" ){

              this.lpNo = code.toUpperCase();
 

              this.onFilter('', this.lpNo);

              this.boolean = true;
              this.loading = false;

            }else{

              this.boolean = true;
              this.loading = false;

              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: `The license plate ${code.toUpperCase()} is not a single`,
                footer: ''
              });

            }
        
          

          }else{

            this.boolean = true;
            this.loading = false;


            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: `The license plate ${code.toUpperCase()} is not in storage`,
              footer: ''
            });
          }

        }else{

          this.boolean = true;
          this.loading = false;

          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: res.Error.Message,
            footer: ''
          });

        }  

         
    
  
    
      
        }
      ).catch(
        err => {
          console.log(err);
        }
      )


  }

 async onSubmit(){

  this.boolean = false;
  this.loading = true;
try {

  let res = await this.wmsService.MergeLPSingle(this.lpNo,this.lp.fields.PLULPDocumentNo);

  if(res.Error) throw new Error(res.Error.Message);

  if(res.message) throw new Error(res.message);
  


   
  this.loading = false;
  
  Swal.fire(
    'Success!',
    `The license plate single ${this.lpNo} has been successfully joined to the LP single ${this.lp.fields.PLULPDocumentNo}`,
    'success'
  )

  
  this.popoverController.dismiss({action: 'join', data: this.lp.fields.PLULPDocumentNo});
  
  
} catch (error) {

  
  this.boolean = true;
  this.loading = false;

  Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: error.message,
    footer: ''
  });
  
}


 


  }


}
