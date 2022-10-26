import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';


@Component({
  selector: 'app-whitem-reclassification',
  templateUrl: './whitem-reclassification.page.html',
  styleUrls: ['./whitem-reclassification.page.scss'],
})
export class WhitemReclassificationPage implements OnInit {

  public frm: FormGroup;

  public binCode:any = '';



  constructor(
    private barcodeScanner: BarcodeScanner,private formBuilder: FormBuilder

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

  onScanLP(){



    this.barcodeScanner.scan().then(
      barCodeData => {
        let lpNo = barCodeData.text;


        this.frm.patchValue({

          lpNo
        })
      


      }
    ).catch(
      err => {
        console.log(err);
      }
    )


  }
  
}
