import { Component, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-popover-locate',
  templateUrl: './popover-locate.component.html',
  styleUrls: ['./popover-locate.component.scss'],
})
export class PopoverLocateComponent implements OnInit {

  @Input() listLocale:any;
  constructor(public popoverController: PopoverController) { }

  ngOnInit() {

    console.log(this.listLocale);
  }

  onClick(locationCode:any){


    this.popoverController.dismiss({locationCode});

  }

}
