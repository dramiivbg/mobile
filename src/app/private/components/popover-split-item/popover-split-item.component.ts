import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-popover-split-item',
  templateUrl: './popover-split-item.component.html',
  styleUrls: ['./popover-split-item.component.scss'],
})
export class PopoverSplitItemComponent implements OnInit {

  @Input() item:any;

  constructor() { }

  ngOnInit() {
    console.log(this.item);
  }

}
