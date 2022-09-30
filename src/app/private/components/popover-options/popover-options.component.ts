import { Component, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-popover-options',
  templateUrl: './popover-options.component.html',
  styleUrls: ['./popover-options.component.scss'],
})
export class PopoverOptionsComponent implements OnInit {
  @Input() options: any = {};

  constructor(private popoverController: PopoverController) { }

  public ngOnInit() {
    
  }

  public closeModal(item: any) {
    console.log(item)
    this.popoverController.dismiss({data: item.obj, action: item.name});
  }

}
