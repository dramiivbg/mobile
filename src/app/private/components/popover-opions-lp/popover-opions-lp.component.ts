import { Component, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-popover-opions-lp',
  templateUrl: './popover-opions-lp.component.html',
  styleUrls: ['./popover-opions-lp.component.scss'],
})
export class PopoverOpionsLpComponent implements OnInit {

  @Input() options: any = {};
  constructor(private popoverController: PopoverController) {

   }

  ngOnInit() {


    
  }

  public closeModal(item: any) {
    console.log(item)
    this.popoverController.dismiss({data: item.obj, name: item.name});
  }



}
