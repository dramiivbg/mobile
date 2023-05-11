import { Component, Input, OnInit } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { PopoverController } from '@ionic/angular';
import { InterceptService } from '@svc/intercept.service';
import { JsonService } from '@svc/json.service';

@Component({
  selector: 'app-popover-select-pallet',
  templateUrl: './popover-select-pallet.component.html',
  styleUrls: ['./popover-select-pallet.component.scss'],
})
export class PopoverSelectPalletComponent implements OnInit {
@Input() pallet:any;
@Input() singles:any;
@Input() listPalletVoid:any;
public No = '';
  
  constructor(private popoverController: PopoverController,private barcodeScanner: BarcodeScanner,
    private intServ: InterceptService,private jsonService: JsonService) { }

  ngOnInit() {
    console.log(this.pallet,this.singles);
    console.log('list void',this.listPalletVoid);
  }


  closePopover(){

   this.popoverController.dismiss({});
 
 }

Send(){

  this.popoverController.dismiss({palletNo: this.No});
 }

 onConfirm() {

  this.barcodeScanner.scan().then(
    async (barCodeData) => {
      let code = barCodeData.text;   

        let line = this.listPalletVoid.find(pallet => pallet.PLULPDocumentNo === code.toUpperCase());

        if(line === undefined || line === null){
          this.intServ.alertFunc(this.jsonService.getAlert('error', '', `Pallet ${code.toUpperCase()} unknown`));
        }else{

          this.No = line.PLULPDocumentNo;
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
