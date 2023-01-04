import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { InterceptService } from '@svc/intercept.service';
import { WmsService } from '@svc/wms.service';


@Component({
  selector: 'app-whitem-reclassification',
  templateUrl: './whitem-reclassification.page.html',
  styleUrls: ['./whitem-reclassification.page.scss'],
})
export class WhitemReclassificationPage implements OnInit {

  public frm: FormGroup;

  public binCode: any = '';

  public lp: any;

  public listItem: any[] = [];
  public lpH: any;

  public company: any = '';

  public PLUQuantity: any = 0;

  public PLUNo: any = '';

  public PLUUnitofMeasureCode: any = '';

  public PLUZoneCode: any = '';

  public PLUBinCode: any = '';

  public boolean: Boolean = true;

  constructor(
    private barcodeScanner: BarcodeScanner, private formBuilder: FormBuilder, private wmsService: WmsService, private intServ: InterceptService

  ) {

    this.frm = this.formBuilder.group(
      {
        bin: [' ', Validators.required],
        qty: [0, Validators.required],
        lpNo: [' ', Validators.required],

      }
    )
  }

  ngOnInit() {
  }


  onScanBin() {


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


  add() {

    let qty = this.frm.get('qty').value;

    qty += 1

    this.frm.get('qty').setValue(qty);

  }

  res() {

    let qty = this.frm.get('qty').value;

    if (qty > 0) {

      qty -= 1

      this.frm.get('qty').setValue(qty);
    }

  }

  onScanLP() {



    this.barcodeScanner.scan().then(
      async (barCodeData) => {
        let lpNo = barCodeData.text.toUpperCase();

        this.intServ.loadingFunc(true);

        let res = await this.wmsService.getLpNo(lpNo);

        this.lp = await this.wmsService.ListLp(res);

        switch (this.lp.fields.PLULPDocumentType) {

          case 'Single':
            console.log(this.lp);

            this.company = this.lp.company;

            this.PLUQuantity = this.lp.fields.PLUQuantity;

            this.PLUNo = this.lp.fields.PLUNo;

            this.PLUUnitofMeasureCode = this.lp.fields.PLUUnitofMeasureCode;

            this.lpH = await this.wmsService.ListLpH(res);

            this.PLUZoneCode = this.lpH.fields.PLUZoneCode;


            let f = new Date(this.lpH.fields.SystemCreatedAt);

            let fecha = f.getDate() + '/' + (f.getMonth() + 1) + '/' + f.getFullYear();

            this.lpH.fields.SystemCreatedAt = fecha;

            this.binCode = this.lpH.fields.PLUBinCode;

            this.PLUBinCode = this.lpH.fields.PLUBinCode;

            let qty = this.lp.fields.PLUQuantity;

            this.frm.setValue({

              bin: this.PLUBinCode,
              lpNo,
              qty
            });


            this.intServ.loadingFunc(false);

            break;


          case 'Pallet':


            this.boolean = false;


            let palletH = await this.wmsService.PalletH(res);

            let palletL = await this.wmsService.PalletL(res);



            palletL.filter(async (lpI) => {

              let lp = await this.wmsService.getLpNo(lpI.PLUNo);

              if (!lp.Error) {

                let Lp = await this.wmsService.ListLp(lp);

                this.listItem.push(Lp);
              }





            });




            //  console.log('palletH =>',palletH);
            //  console.log('palletL =>',palletL);

            console.log('list =>', this.listItem);

            this.intServ.loadingFunc(false);

            break;




        }


      }
    ).catch(
      err => {
        console.log(err);
      }
    )


  }


  onSubmit() {



  }

}
