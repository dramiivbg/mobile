import { Component, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-popover-seriales-lp',
  templateUrl: './popover-seriales-lp.component.html',
  styleUrls: ['./popover-seriales-lp.component.scss'],
})
export class PopoverSerialesLpComponent implements OnInit {


  @Input() seriales:any;

  constructor(public popoverController: PopoverController) { }

  ngOnInit() {

    console.log(this.seriales);
  }

  close(){

    this.popoverController.dismiss({});

  }

}
