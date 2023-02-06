import { Component, Input, OnInit } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { PopoverController } from '@ionic/angular';
import { PopoverListLpComponent } from '../popover-list-lp/popover-list-lp.component';

@Component({
  selector: 'app-popover-list-pallet',
  templateUrl: './popover-list-pallet.component.html',
  styleUrls: ['./popover-list-pallet.component.scss'],
})
export class PopoverListPalletComponent implements OnInit {

  @Input() pallet:any;
  constructor(public popoverController: PopoverController,private barcodeScanner: BarcodeScanner) { }

  ngOnInit() {
    console.log(this.pallet);
  }

  
  async  onBarCode(){

    this.barcodeScanner.scan().then(
      barCodeData => {
        let code = barCodeData.text;
      
        let line = this.pallet.childrens.find(x => x.PLULPDocumentNo === code.toUpperCase() || x.ItemNo === code.toUpperCase() || x.SerialNo === code.toUpperCase() || x.LotNo === code.toUpperCase());
      
        if(line != undefined){

         // this.popoverController.dismiss({});
          this.PopoverList(line);
        
        }
      
      }
    ).catch(
      err => {
        console.log(err);
      }
    )

  }

  
  async PopoverList(obj){

     const popover = await this.popoverController.create({
          component: PopoverListLpComponent,
          cssClass: 'popoverCountingComponent',
          componentProps: {lp:obj,active:false},
          backdropDismiss: false
          
        });
        await popover.present();
        const { data } = await popover.onDidDismiss();

       // console.log(data);
        switch(data.action){
          case 'BintoBin':
            console.log(data);
         // this.popoverController.dismiss({lp:data.lp,action:data.action});
          break;
        }

      }

      onCancel(){
        this.popoverController.dismiss({});
      }

 BinToBin(){

  this.popoverController.dismiss({lp:this.pallet,action:'BintoBin'});
 }
      

}
