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
  @Input() bins:any[];

  @Input() itemsL;

  public lpNo:any = '';
  public lpsT:any;
  public Bin:string = '';

  public listB: any[] = [];
  @Input() whsePutAway: any;

  constructor(private barcodeScanner: BarcodeScanner, private modalCtrl: ModalController, private storage: Storage) { }

  ngOnInit() {
    this.lpsT = this.lps;
    console.log(this.lps);
    console.log(this.itemsL);

  }


  onFilterBin(bin: any) {
    if (bin === '') {
      this.listB = this.bins;
      this.lps = this.lpsT;
      this.Bin = '';
    } else {
     this.Bin = bin.toUpperCase();
      this.lps = this.lpsT.filter(
        x => {
          return (x.fields.place.toLowerCase().includes(bin.toLowerCase()));
        }
      );
    }
  }

  back() {

    this.modalCtrl.dismiss({ data: this.lps, bin: this.bins ,items:this.itemsL});

  }
  autoComplet() {

    this.barcodeScanner.scan().then(
      async (barCodeData) => {


        let code = barCodeData.text;

        this.lpNo = code.toUpperCase();


        this.onFilter('', this.lpNo);   
         }
       ).catch(
         err => {
           console.log(err);
         }
       );
      
      }
 

  


  onFilter(e, lpNo: any = '') {

    switch (lpNo) {
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

  onSubmit() {

    if (this.lps.length > 0) this.modalCtrl.dismiss({ data: this.lps, action: 'register' });

  }

  remove(item: any) {

    this.lps.filter((lp, index) => {
      if (lp.fields.PLULPDocumentNo === item.fields.PLULPDocumentNo) this.lps.splice(index, 1);
    });

    this.lpsT.filter((lp, index) => {
      if (lp.fields.PLULPDocumentNo === item.fields.PLULPDocumentNo) this.lpsT.splice(index, 1);
    });

  this.storage.set(`confirm ${this.whsePutAway.fields.No}`, this.lps);

  }

removeAll(){
  if(this.Bin === ''){
    this.lps = [];
    this.lpsT = [];
    this.bins = [];
    this.itemsL = [];
    this.storage.remove(`confirm ${this.whsePutAway.fields.No}`);
    this.storage.remove(`bins ${this.whsePutAway.fields.No}`);
    this.storage.remove(`itemsL ${this.whsePutAway.fields.No}`);
    this.Bin = '';
  }else{

    let Lps:any[] = [];
    let LpsT:any[] = [];
    let items:any[] = [];

    for (const i in  this.lps) {
      
       if( this.lps[Number(i)].fields.place !== this.Bin) Lps.push(this.lps[Number(i)]);
      
      }
   for (const j in  this.lpsT) {

        if( this.lpsT[Number(j)].fields.place !== this.Bin) LpsT.push(this.lpsT[Number(j)]);
      }

      for (const j in  this.itemsL) {

        if( this.itemsL[Number(j)].place !== this.Bin) items.push(this.itemsL[Number(j)]);
      }

      this.lps = Lps;
      this.lpsT = LpsT;
      this.itemsL = items;
      
    this.storage.set(`confirm ${this.whsePutAway.fields.No}`,this.lps);
   // this.storage.set(`bins ${this.whsePutAway.fields.No}`, this.bins);
   this.storage.set(`itemsL ${this.whsePutAway.fields.No}`, this.itemsL);

  }
     
    }
}
