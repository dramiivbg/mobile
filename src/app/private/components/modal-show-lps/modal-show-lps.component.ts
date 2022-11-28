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

  @Input() pallet:any;

  @Input() listPwL:any;
  public show:boolean = false;

  public lps:any[] = [];
  public lpsT:any[] = [];
  @Input() No:any;

  public LPNo:any = '';
  public boolean:boolean = false;
  constructor(private modalCtrl: ModalController, private wmsService: WmsService,  private barcodeScanner: BarcodeScanner) { 

  }


  ngOnInit() {

    
    this.pallet.fields.filter(async (lp, index) => {

      let res = await this.wmsService.getLpNo(lp.PLUNo);

      let p = await this.wmsService.ListLp(res);

      let pH = await this.wmsService.ListLpH(res);

      let resI = await this.wmsService.GetItem(p.fields.PLUNo);

      let img = await this.wmsService.listItem(resI);

      p.fields['image'] = `data:image/jpeg;base64,${img.fields.Picture}`;
      p.fields.PLUBinCode =  pH.fields.PLUBinCode;
      p.fields.PLULocationCode = pH.fields.PLULocationCode;

      this.listPwL.filter(
       x => {
        switch(x.fields.ActionType){
           case "Place":
             if(p.fields.PLUNo === x.fields.ItemNo){
               p.fields.place = x.fields.BinCode;
               break;
             } 
         }
       }
     )
      this.lps.push(p);
      this.lpsT.push(p);
    });

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

    default:
      this.lps = this.lpsT.filter(
        x => {
           return (x.fields.PLULPDocumentNo.toLowerCase().includes(lPNo.toLowerCase()));
  
          });
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
