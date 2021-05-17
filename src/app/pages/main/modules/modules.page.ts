import { computeMsgId } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { JsonService } from '@svc/json.service';
import { copyFileSync } from 'fs';

import { ApiService } from '@svc/api.service';
import { SqlitePlureService } from '@svc/sqlite-plure.service';
import { __awaiter } from 'tslib';

@Component({
  selector: 'app-modules',
  templateUrl: './modules.page.html',
  styleUrls: ['./modules.page.scss'],
})
export class ModulesPage implements OnInit {
  grid: boolean = false;
  modules: any = [];
  
  constructor(
    private router: Router,
    private js: JsonService,
    private sqLite: SqlitePlureService
  ) { }

  async ngOnInit() {
    let session = await this.js.getSession();
    this.modules = session.login.environment.modules;
  }

  /**
   * Grid
   * @param b 
   */
  onGrid(b) {
    this.grid = b;
  }

  onSales() {
    console.log(this.modules);
    let module = this.modules[0];
    let navigationExtras: NavigationExtras = {
      state: {
        module
      }
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

}
