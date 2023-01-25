import { Component, Input, OnInit } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ModalController } from '@ionic/angular';
import { WmsService } from '@svc/wms.service';

@Component({
  selector: 'app-modal-show-lps',
  templateUrl: './modal-show-lps.component.html',
  styleUrls: ['./modal-show-lps.component.scss'],
})
export class ModalShowLpsComponent implements OnInit {

  @Input() lps:any;

  public show:boolean = false;

  public lpsT:any[] = [];
  @Input() No:any;

  public LPNo:any = '';
  public boolean:boolean = false;
  constructor(private modalCtrl: ModalController, private wmsService: WmsService,  private barcodeScanner: BarcodeScanner) { 

  }


  ngOnInit() {

   this.lpsT = this.lps; 
  this.boolean = true;
  }


  onShow(){

    this.show = !this.show;

  }

  back(){
    this.modalCtrl.dismiss({});
  }

  onFilter(e, lPNo:any = ''){

    switch(lPNo){
      
      case '':
        let val = e.target.value;
       // console.log(val);

        if (val === '') {
          this.lps = this.lpsT;
        } else {
          console.log(this.lps);
          this.lps = this.lpsT.filter(
            x => {
               return (x.fields.PLULPDocumentNo.toLowerCase().includes(val.toLowerCase()));
    
              });      
      }
      break;

    default:
      this.lps = this.lpsT.filter(
        x => {
           return (x.fields.PLULPDocumentNo.toLowerCase().includes(lPNo.toLowerCase()));
  
          });
          break;
    }  
    
  
  }

  
autoComplet(){

  this.barcodeScanner.scan().then(
     async  (barCodeData) => {
         let code = barCodeData.text;
   
   
 
         this.LPNo = code;
 
 
         this.onFilter('',  this.LPNo);
         
   
     
       }
     ).catch(
       err => {
         console.log(err);
       }
     )
    
    }

}
