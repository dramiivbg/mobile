import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-wms-movement',
  templateUrl: './wms-movement.page.html',
  styleUrls: ['./wms-movement.page.scss'],
})
export class WmsMovementPage implements OnInit {


  public vector: any[] = ['Take', 'Place'];
  constructor() { }

  ngOnInit() {
  }


  onBarCode(){


  }

  onSubmit(){

    
  }

}
