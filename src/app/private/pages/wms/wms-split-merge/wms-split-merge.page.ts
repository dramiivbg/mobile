import { Component, OnInit } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { PopoverController } from '@ionic/angular';
import { PopoverMergeComponent } from '@prv/components/popover-merge/popover-merge.component';
import { PopoverSplitComponent } from '@prv/components/popover-split/popover-split.component';

@Component({
  selector: 'app-wms-split-merge',
  templateUrl: './wms-split-merge.page.html',
  styleUrls: ['./wms-split-merge.page.scss'],
})
export class WmsSplitMergePage implements OnInit {

  constructor( private barcodeScanner: BarcodeScanner, public popoverController: PopoverController) { }

  ngOnInit() {
  }


  onFilter(e){

    console.log(e.target.value);



  }


  public onBarCode() {
    this.barcodeScanner.scan().then(
      barCodeData => {
        let code = barCodeData.text;
       

        console.log(code);
      /*  if (line === null || line === undefined) {
          this.intServ.alertFunc(this.js.getAlert('error', 'Error', `The item '${code}' does not exist on this receipt`));
        } else {
          console.log(line);
        }

        */
      }
    ).catch(
      err => {
        console.log(err);
      }
    )
  }

  onSubmit(){


    console.log('guardado');
  }


 async popoverSplit(ev){


    const popover = await this.popoverController.create({
      component: PopoverSplitComponent,
      cssClass: 'popoverSplitComponent',
      event: ev,
      translucent: true,
      componentProps: {}
    });
    await popover.present();

    const { data } = await popover.onDidDismiss();


  }


 async popoverMerge(ev){

    const popover = await this.popoverController.create({
      component: PopoverMergeComponent,
      cssClass: 'popoverSplitComponent',
      event: ev,
      translucent: true,
      componentProps: {}
    });
    await popover.present();

    const { data } = await popover.onDidDismiss();

  }

}
