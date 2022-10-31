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


          if(lp.fields.PLULicensePlateStatus === 'Stored'){

            if(lp.fields.PLUDocumentType === 'Single'){

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

try {

  let res = await this.wmsService.Merge(this.lpNo,this.lp.fields.PLULPDocumentNo);

  if(res.Error) throw new Error(res.Error.Message);




  
  this.popoverController.dismiss({});
  
  
} catch (error) {
  
}


 


  }


}
