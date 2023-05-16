import { Component, Input, OnInit } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { PopoverController } from '@ionic/angular';
import { InterceptService } from '@svc/intercept.service';
import { JsonService } from '@svc/json.service';

@Component({
  selector: 'app-select-pallet-item',
  templateUrl: './select-pallet-item.component.html',
  styleUrls: ['./select-pallet-item.component.scss'],
})
export class SelectPalletItemComponent  implements OnInit {

  @Input() items:any;
  @Input() pallet:any;
  @Input() listPalletVoid:any;
  public No = '';
  constructor(private popoverController: PopoverController,private barcodeScanner: BarcodeScanner,
    private intServ: InterceptService,private jsonService: JsonService) { }

  ngOnInit() {
    console.log(this.listPalletVoid);
  }

  onSubmit(){

    this.popoverController.dismiss({palletNo: this.No});
   }
  
   onConfirm() {
  
    this.barcodeScanner.scan().then(
      async (barCodeData) => {
        let code = barCodeData.text;   
  
          let line = this.listPalletVoid.find(pallet => pallet.LPDocumentNo === code.toUpperCase());
  
          if(line === undefined || line === null){
            this.intServ.alertFunc(this.jsonService.getAlert('error', '', `Pallet ${code.toUpperCase()} unknown`));
          }else{
  
            this.No = line.LPDocumentNo;
          }
  
          console.log(line);    
  
      }
    ).catch(
      err => {
        console.log(err);
      }
    )
  
  }
  
  
  onSelect(p){
  
    this.No = p;
  
    console.log(this.No);
  }

}
