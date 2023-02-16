import { Component, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { InterceptService } from '@svc/intercept.service';
import { JsonService } from '@svc/json.service';

@Component({
  selector: 'app-popover-list-serial-lp',
  templateUrl: './popover-list-serial-lp.component.html',
  styleUrls: ['./popover-list-serial-lp.component.scss'],
})
export class PopoverListSerialLpComponent implements OnInit {

  @Input() list:any;
  constructor(private popoverController: PopoverController,private intServ: InterceptService
    , private jsonService: JsonService) { }

  ngOnInit() {

    console.log(this.list);
  }

  close(){

    this.popoverController.dismiss({list:this.list});

  }

  delete(index:any){

  let con = this.list.splice(Number(index),1);
  console.log(con);
  console.log(this.list);

  }

}
