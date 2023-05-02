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
  public children:any;
  public data = '';
  constructor(public popoverController: PopoverController,private barcodeScanner: BarcodeScanner) { }

  ngOnInit() {
    console.log(this.pallet);
    this.children =   this.pallet.childrens;
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
          cssClass: 'popoverListLpComponent',
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

 onFilter(e, data:any = ''){

  switch(data){

  case  '':

    let val = e.target.value;

    if (val === '') {
      this.pallet.childrens =  this.children;
    } else {
      this.pallet.childrens =  this.children.filter(
        x => {
          return (x.PLULPDocumentNo.toLowerCase().includes(val.toLowerCase()));
        }
      )
    }
    break;

  default:


  this.pallet.childrens = this.children.filter(
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
