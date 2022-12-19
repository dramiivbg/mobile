import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-popover-list-sn',
  templateUrl: './popover-list-sn.component.html',
  styleUrls: ['./popover-list-sn.component.scss'],
})
export class PopoverListSNComponent implements OnInit {

  @Input() seriales:any;
  constructor() { }

  ngOnInit() {

    console.log(this.seriales);
  }

}
