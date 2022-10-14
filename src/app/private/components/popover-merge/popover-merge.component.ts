import { Component, OnInit } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-popover-merge',
  templateUrl: './popover-merge.component.html',
  styleUrls: ['./popover-merge.component.scss'],
})
export class PopoverMergeComponent implements OnInit {

  public lpNo:any = '';
  constructor(private popoverController: PopoverController,  private barcodeScanner: BarcodeScanner) { }

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
    
    
  
          this.lpNo = code;


          this.onFilter('', this.lpNo);
          
    
      
        }
      ).catch(
        err => {
          console.log(err);
        }
      )


  }

 async onSubmit(){



  console.log(this.lpNo);

  this.popoverController.dismiss({});

  }


}
