import { Component, Input, OnInit } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-modal-lps-confirm',
  templateUrl: './modal-lps-confirm.component.html',
  styleUrls: ['./modal-lps-confirm.component.scss'],
})
export class ModalLpsConfirmComponent implements OnInit {

  @Input() lps:any;
  @Input() bins:any;

  public lpNo:any = '';
  public lpsT:any;

  @Input() whsePutAway:any;

  constructor( private barcodeScanner: BarcodeScanner, private modalCtrl: ModalController, private storage: Storage) { }

  ngOnInit() {
    this.lpsT = this.lps;
    console.log(this.lps);

  }


  onFilterBin(bin:any){


    if (bin === '') {
      this.lps = this.lpsT;
    } else {
      this.lps = this.lpsT.filter(
        x => {
          return (x.fields.place.toLowerCase().includes(bin.toLowerCase()));
        }
      )
    }
  }

  back(){

    this.modalCtrl.dismiss({data: this.lps, bin:this.bins});

  }
  autoComplet(){
  
    this.barcodeScanner.scan().then(
       async  (barCodeData) => {

       
          let code = barCodeData.text;
     
           this.lpNo = code.toUpperCase();
 
 
           this.onFilter('', this.lpNo);
           
     
       
         }
       ).catch(
         err => {
           console.log(err);
         }
       )
      
      }


  onFilter(e, lpNo:any = ''){

   switch(lpNo){
    case '':
        let val = e.target.value;

        console.log(val);
    
        if (val === '') {
          this.lps = this.lpsT;
        } else {
          this.lps = this.lpsT.filter(
            x => {
              return (x.fields.PLULPDocumentNo.toLowerCase().includes(val.toLowerCase()));
            }
          )
        }
        break;
    
     default:
    
    
      this.lps = this.lpsT.filter(
        x => {
          return (x.fields.PLULPDocumentNo.toLowerCase().includes(lpNo.toLowerCase()));
        }
      )
       

     break;
      }
    
  }

  onSubmit(){


  }

  remove(item:any){

   this.lps.map((lp,index) => {
   if(lp.fields.PLULPDocumentNo === lp.fields.PLULPDocumentNo) this.lps.splice(index,1);
  });

    this.storage.set(`confirm ${this.whsePutAway.fields.No}`, this.lps);

  }

  removeAll(){
    this.lps = [];
    this.storage.remove(`confirm ${this.whsePutAway.fields.No}`);
    this.storage.remove(`bins ${this.whsePutAway.fields.No}`);
    this.bins = [];
  }
}
