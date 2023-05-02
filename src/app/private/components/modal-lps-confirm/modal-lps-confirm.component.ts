import { Component, Input, OnInit } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ModalController, PopoverController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { PopoverSerialesLpComponent } from '../popover-seriales-lp/popover-seriales-lp.component';

@Component({
  selector: 'app-modal-lps-confirm',
  templateUrl: './modal-lps-confirm.component.html',
  styleUrls: ['./modal-lps-confirm.component.scss'],
})
export class ModalLpsConfirmComponent implements OnInit {

  @Input() lps: any;
  @Input() bins: any[];

  @Input() itemsL;

  public itemLT;

  public lpNo: any = '';
  public lpsT: any;
  public Bin: string = '';

  public deleteI: any[] = [];

  public qtyR = 0;

  public listB: any[] = [];
  @Input() whsePutAway: any;

  constructor(private barcodeScanner: BarcodeScanner, private modalCtrl: ModalController, private storage: Storage,public popoverController: PopoverController) { }

  ngOnInit() {
    this.lpsT = this.lps;
    this.itemLT = this.itemsL;
    console.log(this.lps);
    console.log(this.itemsL);

  }


  onFilterBin(bin: any) {
    if (bin === '') {
      this.listB = this.bins;
      this.lps = this.lpsT;
      this.itemsL = this.itemLT;
      this.Bin = '';
    } else {
      this.Bin = bin.toUpperCase();
      this.lps = this.lpsT.filter(
        x => {
          return (x.place.toLowerCase().includes(bin.toLowerCase()));
        }
      );

      this.itemsL = this.itemLT.filter(
        x => {
          return (x.place.toLowerCase().includes(bin.toLowerCase()));
        }
      );
    }
  }

  back() {

    this.modalCtrl.dismiss({ data: this.lps, bin: this.bins, items: this.itemsL, delete: this.deleteI, qtyR: this.qtyR });

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
          this.itemsL = this.itemLT;
        } else {
          this.lps = this.lpsT.filter(
            x => {
              return (x.LPDocumentNo.toLowerCase().includes(val.toLowerCase()));
            }
          )

          this.itemsL = this.itemLT.filter(
            x => {
              return (x.ItemNo.toLowerCase().includes(val.toLowerCase()) || x.SerialNo.toLowerCase().includes(val.toLowerCase())
              || x.LotNo.toLowerCase().includes(val.toLowerCase()));
            }
          )


        }
        break;

      default:


        this.lps = this.lpsT.filter(
          x => {
            return (x.LPDocumentNo.toLowerCase().includes(lpNo.toLowerCase()));
          }
        )

        this.itemsL = this.itemLT.filter(
          x => {
            return (x.ItemNo.toLowerCase().includes(lpNo.toLowerCase()) || x.SerialNo.toLowerCase().includes(lpNo.toLowerCase())
            || x.LotNo.toLowerCase().includes(lpNo.toLowerCase()));
          }
        )

        break;
    }

  }

  async show(lp:any){

    if(lp.serial){

      const popoverI = await this.popoverController.create({
        component: PopoverSerialesLpComponent,
        cssClass: 'popoverSerialesLpComponent',
        backdropDismiss: false,
        componentProps: {seriales:lp.LPLines},
      });
      await popoverI.present();
  
      const { data } = await popoverI.onWillDismiss();

    }
  }

 async onSubmit() {

        let items: any[] = [];
        for (const key in this.itemsL) {
  
          let line = items.find(item => item === this.itemsL[key].LineNo);
          if(line === null || line === undefined)items.push(this.itemsL[key].LineNo);   
        }
  
        let groupItems: any[] = [];
  
        let list: any[] = [];
  
        for (const key in items) {
  
          for (const j in this.itemsL) {
  
            if(this.itemsL[j].LineNo === items[key]){
              list.push(this.itemsL[j]);
            }
  
          }
          console.log(list);
  
          groupItems[items[key]] = list;
  
          list = [];
  
        }
  
        console.log(groupItems);
  
        this.modalCtrl.dismiss({ data: this.lps, bin: this.bins, items: this.itemsL, action: 'register', itemsG: groupItems , delete: this.deleteI, qtyR: this.qtyR});
      
  }

  remove(item: any) {

    this.lps.filter((lp, index) => {
      if (lp.LPDocumentNo === item.LPDocumentNo){
      this.lps.splice(index, 1);
      this.qtyR++;
      }
    });

    this.lpsT.filter((lp, index) => {
      if (lp.LPDocumentNo === item.LPDocumentNo) this.lpsT.splice(index, 1);
    });

    this.storage.set(`confirm ${this.whsePutAway.fields.No}`, this.lps);

  }

  removeI(item: any) {

    this.itemsL.filter((Item, index) => {
      if (item.LineNo === Item.LineNo) {
        this.deleteI.push(item);
        this.itemsL.splice(index, 1);
        this.qtyR++;
      }
    });

    this.itemLT.filter((Item, index) => {
      if (item.LineNo === Item.LineNo) this.itemLT.splice(index, 1);
    });

    this.storage.set(`itemsL ${this.whsePutAway.fields.No}`, this.itemLT);

  }
  removeAll() {
    if (this.Bin === '') {
      this.qtyR += this.lps.length + this.itemsL.length;
      this.deleteI = this.itemsL;
      this.lps = [];
      this.lpsT = [];
      this.bins = [];
      this.itemsL = [];
      this.storage.remove(`confirm ${this.whsePutAway.fields.No}`);
      this.storage.remove(`bins ${this.whsePutAway.fields.No}`);
      this.storage.remove(`itemsL ${this.whsePutAway.fields.No}`);
      this.Bin = '';
    } else {

      let Lps: any[] = [];
      let LpsT: any[] = [];
      let items: any[] = [];

      for (const i in this.lps) {

        if (this.lps[Number(i)].place !== this.Bin)Lps.push(this.lps[Number(i)]);
      }


      this.qtyR += this.lps.length - Lps.length;


      for (const j in this.itemsL) {

        if (this.itemsL[Number(j)].place !== this.Bin) items.push(this.itemsL[Number(j)]);
        if (this.itemsL[Number(j)].place === this.Bin) this.deleteI.push(this.itemsL[Number(j)]);
      }

      this.qtyR += this.itemsL.length - items.length;

      this.lps = Lps;
      this.lpsT = Lps;
      this.itemsL = items;
      this.itemLT = items;

      this.storage.set(`confirm ${this.whsePutAway.fields.No}`, this.lps);
      // this.storage.set(`bins ${this.whsePutAway.fields.No}`, this.bins);
      this.storage.set(`itemsL ${this.whsePutAway.fields.No}`, this.itemsL);

    }

  }
}