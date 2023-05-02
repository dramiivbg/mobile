import { Component, Input, OnInit } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ModalController, PopoverController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { PopoverSerialesLpComponent } from '../popover-seriales-lp/popover-seriales-lp.component';
import * as cloneDeep from 'lodash/cloneDeep';

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

  public lpsR = [];
  public itemR = [];
  public itemB = [];
  public lpsB = [];

  public lpNo: any = '';
  public lpsT: any;
  public Bin: string = '';

  public deleteI: any[] = [];

  public qtyR = 0;

  public listB: any[] = [];
  @Input() whsePutAway: any;

  constructor(private barcodeScanner: BarcodeScanner, private modalCtrl: ModalController, private storage: Storage,public popoverController: PopoverController) { }

  ngOnInit() {
    this.lpsT = cloneDeep(this.lps);
    this.itemLT = cloneDeep(this.itemsL);
    console.log(this.lps);
    console.log(this.itemsL);
    
    this.lpsR = cloneDeep(this.lps);
    this.itemR = cloneDeep(this.itemsL);
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

    let data = [];

    let items = [];

    this.lpsR.map(x => {
      let find = this.lpsB.find(i => i.LPDocumentNo === x.LPDocumentNo);

      if(find === undefined)data.push(x);
    });

    this.itemR.map(x => {
      let find = this.itemB.find(i => i.LineNo === x.LineNo && i.identify === x.identify);

      if(find === undefined)items.push(x);
    });

    this.modalCtrl.dismiss({ data, bin: this.bins, items, delete: this.itemB});

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

  
  let data = [];

  let itemsT = [];

  this.lpsR.map(x => {
    let find = this.lpsB.find(i => i.LPDocumentNo === x.LPDocumentNo);

    if(find === undefined)data.push(x);
  });

  this.itemR.map(x => {
    let find = this.itemB.find(i => i.LineNo === x.LineNo && i.identify === x.identify);

    if(find === undefined)itemsT.push(x);
  });

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
  
        this.modalCtrl.dismiss({ data, bin: this.bins, items: itemsT, action: 'register', itemsG: groupItems , delete: this.itemB});
      
  }

  remove(item: any) {

    this.lpsB.push(item);

    this.lps.filter((lp, index) => {
      if (lp.LPDocumentNo === item.LPDocumentNo){
      this.lps.splice(index, 1);
      }
    });

    this.lpsT.filter((lp, index) => {
      if (lp.LPDocumentNo === item.LPDocumentNo) this.lpsT.splice(index, 1);
    });

    this.storage.set(`confirm ${this.whsePutAway.fields.No}`, this.lps);

  }

  removeI(item: any) {

    this.itemsL.filter((Item, index) => {
      if (Item.LineNo === item.LineNo && Item.identify === item.identify) {
        this.itemB.push(Item);
        console.log('posicion',index);
        this.itemsL.splice(index, 1);
      }
    });

    this.itemLT.filter((Item, index) => {
      if (item.LineNo === Item.LineNo && Item.identify === item.identify) this.itemLT.splice(index, 1);
    });

    this.storage.set(`itemsL ${this.whsePutAway.fields.No}`, this.itemsL);

  }
  removeAll() {
    this.lpsB = cloneDeep(this.lps);
    this.itemB = cloneDeep(this.itemsL);

    if (this.Bin === '') {
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



      for (const j in this.itemsL) {

        if (this.itemsL[Number(j)].place !== this.Bin) items.push(this.itemsL[Number(j)]);
        if (this.itemsL[Number(j)].place === this.Bin) this.deleteI.push(this.itemsL[Number(j)]);
      }


      this.lps = cloneDeep(Lps);
      this.lpsT = cloneDeep(Lps);
      this.itemsL = cloneDeep(items);
      this.itemLT = cloneDeep(items);

      this.storage.set(`confirm ${this.whsePutAway.fields.No}`, this.lps);
      // this.storage.set(`bins ${this.whsePutAway.fields.No}`, this.bins);
      this.storage.set(`itemsL ${this.whsePutAway.fields.No}`, this.itemsL);

    }

  }
}
