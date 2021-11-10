import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GeneralService } from '@svc/general.service';
import { ModuleService } from '@svc/gui/module.service';
import { InterceptService } from '@svc/intercept.service';
import { JsonService } from '@svc/json.service';
import { SyncerpService } from '@svc/syncerp.service';

@Component({
  selector: 'app-payment-main',
  templateUrl: './payment-main.page.html',
  styleUrls: ['./payment-main.page.scss'],
})
export class PaymentMainPage implements OnInit {
  public sessionLogin: any = {};
  public session: any = {};
  public module: any = {};
  public salesCount: any = {};

  constructor(private syncerp: SyncerpService
    , private general: GeneralService
    , private intServ: InterceptService
    , private js: JsonService
    , private router: Router
    , private moduleService: ModuleService
  ) { }

  ngOnInit() {
  }

  public async ionViewWillEnter() {
    try {
      this.intServ.loadingFunc(true);
      this.module = await this.moduleService.getSelectedModule();
      this.session = (await this.js.getSession()).login;
      this.intServ.loadingFunc(false);
    } catch (error) {
      this.intServ.loadingFunc(false);
    }
  }

}
