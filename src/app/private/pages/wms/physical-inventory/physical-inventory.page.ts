import { Component, OnInit } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Storage } from '@ionic/storage';
import { InterceptService } from '@svc/intercept.service';
import { JsonService } from '@svc/json.service';

@Component({
  selector: 'app-physical-inventory',
  templateUrl: './physical-inventory.page.html',
  styleUrls: ['./physical-inventory.page.scss'],
})
export class PhysicalInventoryPage implements OnInit {

  public lists:any;
  public bins:any[] = [];
  public listT:any[] = [];
  public list:any[] = [];
  public bin:any = '';
  public lps:any[] = [];
  constructor(private storage: Storage ,private intServ: InterceptService
    , private js: JsonService, private barcodeScanner: BarcodeScanner) { }

 async ngOnInit() {
  this.lists = await  this.storage.get('inventory');

  for (const key in this.lists) {
    
    let line = this.bins.find(x => x === this.lists[key].BinCode);

    if(line === undefined || line === null)this.bins.push(this.lists[key].BinCode);
  }

  console.log(this.lists);
  console.log(this.bins);

  this.intServ.loadingFunc(false);

  }

 async onScanBin(){

  this.barcodeScanner.scan().then(
    barCodeData => {
      let code = barCodeData.text;
      let line = this.bins.find(x => x === code.toUpperCase());

      if(line != undefined){

        this.bin = line;

        this.lists.map(x => {if(x.BinCode === line)this.list.push(x)});

      }
    }
  ).catch(
    err => {
      console.log(err);
    }
  )

  this.listT = this.list;
  console.log(this.list);

  }

 async onScanAll(){

  this.barcodeScanner.scan().then(
    barCodeData => {
      let code = barCodeData.text;

      if(this.list.length > 0){

        let line = this.list.find(x => x.PLULicensePlates === code.toUpperCase() || x.ItemNo === code.toUpperCase() || x.SerialNo);
        let line2 = this.lps.find(x => x.PLULicensePlates === code.toUpperCase() || x.ItemNo === code.toUpperCase() || x.SerialNo);

        if((line !== undefined) && (line2 === undefined || line2 === null))this.lps.push(line);
      }else{

        
        let line = this.lists.find(x => x.PLULicensePlates === code.toUpperCase() || x.ItemNo === code.toUpperCase() || x.SerialNo);
        let line2 = this.lps.find(x => x.PLULicensePlates === code.toUpperCase() || x.ItemNo === code.toUpperCase() || x.SerialNo);

        if((line !== undefined) && (line2 === undefined || line2 === null))this.lps.push(line);

      }
     
    }
  ).catch(
    err => {
      console.log(err);
    }
  )
  }

}
