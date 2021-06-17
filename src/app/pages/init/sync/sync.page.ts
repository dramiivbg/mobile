import { Component, OnInit } from '@angular/core';
import { AuthService } from '@svc/auth.service';
import { InterceptService } from '@svc/intercept.service';
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

  constructor(
    private syncErp: SyncerpService,
    private intServ: InterceptService,
    private authService: AuthService
  ) { }

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

  async onSyncTables(mod) : Promise<void> {
    this.intServ.loadingFunc(true);
    let b = await this.syncErp.sycnAll(mod);
    this.intServ.loadingFunc(false);
  }

}
