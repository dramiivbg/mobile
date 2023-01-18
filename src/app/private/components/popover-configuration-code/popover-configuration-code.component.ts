import { Component, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { WmsService } from '@svc/wms.service';

@Component({
  selector: 'app-popover-configuration-code',
  templateUrl: './popover-configuration-code.component.html',
  styleUrls: ['./popover-configuration-code.component.scss'],
})
export class PopoverConfigurationCodeComponent implements OnInit {

  @Input() code:any;
  constructor( public popoverController: PopoverController) { }

 async ngOnInit() {
  console.log(this.code);
  
  }

  close(){

    this.popoverController.dismiss({});

  }

}
