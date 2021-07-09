import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { __awaiter } from 'tslib';

// import services
import { ApiService } from '@svc/api.service';
import { SqlitePlureService } from '@svc/sqlite-plure.service';
import { AuthService } from '@svc/auth.service';
import { ModuleService } from '@svc/gui/module.service';

// import vars
import { E_MODULETYPE } from '@var/enums';
import { InterceptService } from '@svc/intercept.service';
import { JsonService } from '@svc/json.service';

import { Plugins } from '@capacitor/core';
import { Storage } from '@ionic/storage';
import { SK_ENVIRONMENT } from '@var/consts';
const { App } = Plugins;

export interface Module {
  description: string,
  icon: string,
  moduleType: E_MODULETYPE
}

@Component({
  selector: 'app-modules',
  templateUrl: './modules.page.html',
  styleUrls: ['./modules.page.scss'],
})
export class ModulesPage implements OnInit {
  grid: boolean = false;
  modules: any = [];
  environment: any = {};
  envShort: string = '';

  constructor(private router: Router
    , private sqLite: SqlitePlureService
    , private authService: AuthService
    , private moduleService: ModuleService
    , private intServ: InterceptService
    , private js: JsonService
    , private storage: Storage
  )
  {
    let objBack = {
      func: () => {
        this.intServ.alertFunc(this.js.getAlert('confirm', 'Confirm', 'Do you want to close the app?',
          () => {
            App.exitApp();
          }
        ));
      }
    }
    this.intServ.appBackFunc(objBack);
  }

  async ngOnInit() {
    this.authService.getUserSession()
    .then(
      res => {
        this.environment = res.environment;
        for(let i in this.environment.modules) {
          let moduleType: E_MODULETYPE = this.environment.modules[i].moduleType;
          let obj: any = this.environment.modules[i];
          obj['icon'] = E_MODULETYPE[moduleType].toLowerCase();
          this.modules.push(obj);
        }
      }
    );
    let environment = await this.storage.get(SK_ENVIRONMENT);
    if (environment === 'DEV') this.envShort = environment;
    if (environment === 'TEST') this.envShort = environment;
  }

  /**
   * Grid
   * @param b
   */
  onGrid(b: boolean) {
    this.grid = b;
  }

  async onClick(mod: any) {
    await this.moduleService.setSelectedModule(mod);

    switch(mod.moduleType)
    {
      case E_MODULETYPE.Sales:
        this.onSales(mod);
        break;

      case E_MODULETYPE.Purchases:
        break;

      case E_MODULETYPE.WMS:
        break;

      case E_MODULETYPE.Manufacturing:
        break;

      default:
        break;
    }
  }

  onSales(module: any) {
    let navigationExtras: NavigationExtras = {
      state: {
        module
      },
      replaceUrl: true
    };
    this.router.navigate(['sales/sales-main'], navigationExtras);
  }

  async onTestSqLite() {
    await this.sqLite.init();
    await this.sqLite.openStorageOptions();
    let store = await this.sqLite.openStore();
    if (store) {
      // await this.sqLite.setItem('GetCustomers', 'Hola');
      let test = await this.sqLite.getItem('GetCustomers');
    }
  }

  onStripePay() {
    this.intServ.stripePayFunc({
      CustomerId: 'cus_JdUmBlhv2Ofiey',
      Currency: 'usd',
      Amount: 5000,
      DocumentNum: 'inv-2'
    });
  }

}
