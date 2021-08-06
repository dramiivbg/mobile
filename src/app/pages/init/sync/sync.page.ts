import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@svc/auth.service';
import { InterceptService } from '@svc/intercept.service';
import { JsonService } from '@svc/json.service';
import { SecondTaskService } from '@svc/secondTask.service';
import { SyncerpService } from '@svc/syncerp.service';
import { E_MODULETYPE } from '@var/enums';

@Component({
  selector: 'app-sync',
  templateUrl: './sync.page.html',
  styleUrls: ['./sync.page.scss'],
})
export class SyncPage implements OnInit {
  modules: any = [];
  environment: any = {};

  constructor(private syncErp: SyncerpService
    , private intServ: InterceptService
    , private authService: AuthService
    , private router: Router
    , private js: JsonService
    , private secondTaks: SecondTaskService
  ) {
     let objFunc = {
      func: () => {
        this.onBack();
      }
    };
    this.intServ.appBackFunc(objFunc);
  }

  async ngOnInit() {
    let res = await this.authService.getUserSession();
    this.environment = res.environment;
    for(let i in this.environment.modules) {
      let moduleType: E_MODULETYPE = this.environment.modules[i].moduleType;
      let obj: any = this.environment.modules[i];
      obj['icon'] = E_MODULETYPE[moduleType].toLowerCase();
      this.modules.push(obj);      
    }
  }

  /**
    * Return to the modules.
    */
  onBack() {
    this.router.navigate(['modules'], {replaceUrl: true});
  }

  async onSyncTables(mod) : Promise<void> {
    this.intServ.loadingFunc(true);
    let b = this.syncErp.sycnAll(mod);
    // if (b) {
    //   this.intServ.alertFunc(this.js.getAlert('success', 'Success', 'Sales are correctly synchronized'));
    // }
    this.intServ.loadingFunc(false);
  }

}
