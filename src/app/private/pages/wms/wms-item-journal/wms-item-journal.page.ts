import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { IonInfiniteScroll, PopoverController } from '@ionic/angular';
import { PopoverLpEmptyComponent } from '@prv/components/popover-lp-empty/popover-lp-empty.component';
import { InterceptService } from '@svc/intercept.service';

@Component({
  selector: 'app-wms-item-journal',
  templateUrl: './wms-item-journal.page.html',
  styleUrls: ['./wms-item-journal.page.scss'],
})
export class WmsItemJournalPage implements OnInit {



  public boolean:Boolean = false;

  public buttonmenuprinc:Boolean = true;


  public frm: FormGroup;


  public binCode:any = '';


  public zone:any = '';

  constructor(public router: Router, public popoverController: PopoverController, private intServ: InterceptService, 
    private barcodeScanner: BarcodeScanner, private formBuilder: FormBuilder) { 


      this.frm = this.formBuilder.group(
        {
          bin: [' ', Validators.required],
          qty: [0, Validators.required],
          ItemNo: [' ', Validators.required],
          lpNo: [' ', Validators.required],
    
        }
      )
    }

  

  ngOnInit() {
  }


  back(){


    this.router.navigate(['page/main/modules']);
  }

 async newLP(ev){



  this.intServ.loadingFunc(true);

    const popover = await this.popoverController.create({
      component: PopoverLpEmptyComponent,
      cssClass: 'popoverLpEmptyComponent',
      event: ev,
      translucent: true,
    
      backdropDismiss: false
    });
   
    this.intServ.loadingFunc(false);
    
    await popover.present();
    const { data } = await popover.onDidDismiss();


    if(data != null){


      this.zone = data.zone.toUpperCase();
      this.buttonmenuprinc = false;

      let lpNo = data.data.LPNo;


      this.frm.patchValue({

        lpNo 

      })

      this.boolean = true;

    }
  

  }

  add(){

  let qty =  this.frm.get('qty').value;

    qty +=1

    this.frm.get('qty').setValue(qty);

  }

  res(){

    let qty =  this.frm.get('qty').value;

    if(qty > 0){
 
     qty -=1

     this.frm.get('qty').setValue(qty);
     }

  }

  newPallet(){


    console.log('new Pallet');

  }

  Details(){


    console.log('Details');

  }

  onSubmit(){


  }


  onBarCode(){

    this.barcodeScanner.scan().then(
      barCodeData => {
        let code = barCodeData.text;
     
      }
    ).catch(
      err => {
        console.log(err);
      }
    )

    
  }


  onScanBin(){


    this.barcodeScanner.scan().then(
      barCodeData => {
        let bin = barCodeData.text.toUpperCase();

        this.binCode = barCodeData.text.toUpperCase();


        this.frm.patchValue({

          bin
        })
    
      }
    ).catch(
      err => {
        console.log(err);
      }
    )



  }


  onScanItem(){



    this.barcodeScanner.scan().then(
      barCodeData => {
        let ItemNo = barCodeData.text;


        this.frm.patchValue({

          ItemNo
        })
      


      }
    ).catch(
      err => {
        console.log(err);
      }
    )


  }
}
