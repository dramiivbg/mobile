import { Component, OnInit } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';


@Component({
  selector: 'app-whitem-reclassification',
  templateUrl: './whitem-reclassification.page.html',
  styleUrls: ['./whitem-reclassification.page.scss'],
})
export class WhitemReclassificationPage implements OnInit {

  constructor(
    private barcodeScanner: BarcodeScanner

  ) { }

  ngOnInit() {
  }
  
}
