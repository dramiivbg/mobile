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
  public listBin:any[] = [];

  @Input() whsePutAway:any;

  constructor( private barcodeScanner: BarcodeScanner, private modalCtrl: ModalController, private storage: Storage) { }

  ngOnInit() {
    this.lpsT = this.lps;
    console.log(this.lps);

  }


  onFilterBin(bin:any){


    if (bin === '') {
      this.lps = this.lpsT;
      this.listBin = this.bins;
    } else {
      let line = this.listBin.find(bin1 => bin1 === bin);
      if(line === undefined || line === null)this.listBin.push(bin);
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

    if(this.lps.length > 0) this.modalCtrl.dismiss({data: this.lps, action: 'register'});



  }

  remove(item:any){

   this.lps.filter((lp,index) => {
   if(lp.fields.PLULPDocumentNo === item.fields.PLULPDocumentNo) this.lps.splice(index,1);
  });

  this.lpsT.filter((lp,index) => {
    if(lp.fields.PLULPDocumentNo === item.fields.PLULPDocumentNo) this.lpsT.splice(index,1);
   });

    this.storage.set(`confirm ${this.whsePutAway.fields.No}`, this.lps);

  }

removeAll(){

  if(this.listBin.length > 0){
    this.listBin.filter(bin => {
        this.lps.filter((lp,index) => {
          if(lp.fields.place === bin) this.lps.splice(index,1);
        });

        this.lpsT.filter((lp,index) => {
          if(lp.fields.place === bin) this.lpsT.splice(index,1);
          });
      });

      this.storage.set(`confirm ${this.whsePutAway.fields.No}`,this.lps);
      this.storage.set(`bins ${this.whsePutAway.fields.No}`, this.bins);

  }else{
      this.lps = [];
      this.lpsT = [];
      this.bins = [];
      this.storage.remove(`confirm ${this.whsePutAway.fields.No}`);
      this.storage.remove(`bins ${this.whsePutAway.fields.No}`);

    }
    
  }
}
