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
  public children:any;
  public data = '';
  constructor(public popoverController: PopoverController,private barcodeScanner: BarcodeScanner) { }

  ngOnInit() {
    console.log(this.item);
    this.children =  this.item.childrens;
  }

  async show(item:any){

    let list = [];

    item.seriales[0].Quantity = (item.seriales.length === 1)?item.QtyPhysInventoryBase:item.seriales[0].Quantity;
    
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
      
        let line = this.item.childrens.find(x => x.PLULPDocumentNo === code.toUpperCase() || x.ItemNo === code.toUpperCase() || x.SerialNo === code.toUpperCase() || x.LotNo === code.toUpperCase());
      
        if(line != undefined){

         this.popoverController.dismiss({line});
          
        
        }
      
      }
    ).catch(
      err => {
        console.log(err);
      }
    )

  }

  onCancel(){
    this.popoverController.dismiss({});
  }


  
 onFilter(e, data:any = ''){

  switch(data){

  case  '':

    let val = e.target.value;

    if (val === '') {
      this.item.childrens =  this.children;
    } else {
      this.item.childrens =  this.children.filter(
        x => {
          return (x.PLULPDocumentNo.toLowerCase().includes(val.toLowerCase()));
        }
      )
    }
    break;

  default:


  this.item.childrens = this.children.filter(
      x => {
        return (x.PLULPDocumentNo.toLowerCase().includes(data.toLowerCase()));
      }
    )
    break;
  }
  }


 autoComplet(){

     this.barcodeScanner.scan().then(
       async  (barCodeData) => {
           let code = barCodeData.text;
      
           this.data = code;
  
           this.onFilter('', this.data);
                  
         }
       ).catch(
         err => {
           console.log(err);
         }
       )
 
   }


}
