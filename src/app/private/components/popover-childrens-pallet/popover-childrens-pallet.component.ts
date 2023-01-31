import { Component, Input, OnInit } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { PopoverController } from '@ionic/angular';
import { PopoverCountingComponent } from '../popover-counting/popover-counting.component';
import { PopoverListSNComponent } from '../popover-list-sn/popover-list-sn.component';

@Component({
  selector: 'app-popover-childrens-pallet',
  templateUrl: './popover-childrens-pallet.component.html',
  styleUrls: ['./popover-childrens-pallet.component.scss'],
})
export class PopoverChildrensPalletComponent implements OnInit {

  @Input() item:any
  @Input() count:boolean;
  constructor(public popoverController: PopoverController,private barcodeScanner: BarcodeScanner) { }

  ngOnInit() {
    console.log(this.item);
  }

  async show(item:any){

    let list = [];
    
        if(item.seriales.length > 0){
  
          item.seriales.map(x => {x['proceded'] = false; list.push(x)});

          let boolean = (item.LotNo === null && item.SerialNo === null)?true:false;
      
          const popover = await this.popoverController.create({
            component: PopoverListSNComponent,
            cssClass: 'popoverListSNComponent-modal',
            componentProps: { list, boolean },
          });     
          await popover.present();
        }
  }

  async  onBarCode(){

    this.barcodeScanner.scan().then(
      barCodeData => {
        let code = barCodeData.text;
      
        let line = this.item.childrens.find(x => x.PLULicensePlates === code.toUpperCase() || x.ItemNo === code.toUpperCase() || x.SerialNo === code.toUpperCase() || x.LotNo === code.toUpperCase());
      
        if(line != undefined){

          this.popoverController.dismiss({});
          this.counting(line);
        
        }
      
      }
    ).catch(
      err => {
        console.log(err);
      }
    )

  }

  async counting(obj){

    const popover = await this.popoverController.create({
      component: PopoverCountingComponent,
      cssClass: 'popoverCountingComponent',
      componentProps: {list:obj},
      backdropDismiss: false
      
    });
    await popover.present();
    const { data } = await popover.onDidDismiss();
  }

}
