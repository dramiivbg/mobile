import { Component, Input, OnInit } from '@angular/core';
import { InterceptService } from '@svc/intercept.service';

@Component({
  selector: 'app-popover-log-lp',
  templateUrl: './popover-log-lp.component.html',
  styleUrls: ['./popover-log-lp.component.scss'],
})
export class PopoverLogLpComponent implements OnInit {


  @Input() logs: any = {} ;
 
  constructor( private intServ: InterceptService) { }

  ngOnInit() {


   
  }

}
