import { Component, OnInit } from '@angular/core';
import { getDefaultSettings } from 'http2';
import { BrowserStack } from 'protractor/built/driverProviders';
import { InterceptService } from 'src/app/services/intercept.service';

@Component({
  selector: 'alert-message',
  templateUrl: './alerts.component.html'
})
export class AlertsComponent implements OnInit {
  alertObj: any = {};
  testBool: boolean = false;

  constructor(
    private interceptService: InterceptService
  ) { 
    interceptService.alert$.subscribe(
      (obj: any) => {
        this.alertObj = obj;
      }
    )
  }

  ngOnInit() {
  }

  // Ok - hide alert
  onOk() {
    if ( this.alertObj.func !== undefined && this.alertObj.type !== 'confirm' )
      this.alertObj.func();
    this.alertObj = {};
  }

  onYes() {
    this.alertObj.func();
    this.alertObj = {};
  }

}
