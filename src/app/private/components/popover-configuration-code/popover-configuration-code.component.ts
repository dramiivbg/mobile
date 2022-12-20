import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-popover-configuration-code',
  templateUrl: './popover-configuration-code.component.html',
  styleUrls: ['./popover-configuration-code.component.scss'],
})
export class PopoverConfigurationCodeComponent implements OnInit {

  @Input() code:any;
  constructor() { }

  ngOnInit() {

    console.log(this.code);
  }

}
