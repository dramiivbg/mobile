import { Component, OnInit } from '@angular/core';
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
  constructor(private storage: Storage ,private intServ: InterceptService
    , private js: JsonService) { }

 async ngOnInit() {

  this.lists = await  this.storage.get('inventory');

  console.log(this.lists);

  this.intServ.loadingFunc(false);

  }

}
