import { Component, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { InterceptService } from '@svc/intercept.service';

@Component({
  selector: 'app-popover-opions-lp',
  templateUrl: './popover-opions-lp.component.html',
  styleUrls: ['./popover-opions-lp.component.scss'],
})
export class PopoverOpionsLpComponent implements OnInit {

  @Input() options: any = {};
  constructor(private popoverController: PopoverController, private intServ: InterceptService) {

  }

  ngOnInit() {

  }

  public closeModal(item: any) {
    console.log(item)
    this.popoverController.dismiss({ data: item.obj, name: item.name });
  }



}
