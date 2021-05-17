import { computeMsgId } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { JsonService } from '@svc/json.service';
import { copyFileSync } from 'fs';

// import services
import { ApiService } from '@svc/api.service';
<<<<<<< HEAD
import { SqlitePlureService } from '@svc/sqlite-plure.service';
import { __awaiter } from 'tslib';
=======
import { AuthService } from '@svc/auth.service';

// import vars
import { E_MODULETYPE } from '@var/enums';

export interface Module {
  description: string,
  icon: string,
  moduleType: E_MODULETYPE
}
>>>>>>> 35ced91266e63f65f3cb6cf3542566366610805c

@Component({
  selector: 'app-modules',
  templateUrl: './modules.page.html',
  styleUrls: ['./modules.page.scss'],
})
export class ModulesPage implements OnInit {
  grid: boolean = false;
  modules: Array<Module> = [];  
  environment: any = {};
  
  constructor(
    private router: Router,
<<<<<<< HEAD
    private js: JsonService,
    private sqLite: SqlitePlureService
=======
    private authService: AuthService
>>>>>>> 35ced91266e63f65f3cb6cf3542566366610805c
  ) { }

  async ngOnInit() {
    this.authService.getUserSession()
    .then(
      res => {
        this.environment = res.environment;
        this.environment.modules.forEach((module: any) => {
          let moduleType: E_MODULETYPE = module.moduleType;
          console.log(module);
          this.modules.push({
            description: module.description,
            icon: E_MODULETYPE[moduleType].toLowerCase(),
            moduleType: moduleType
          });
        });
      }
    );
    
    console.log(this.modules);
  }  

  /**
   * Grid
   * @param b 
   */
  onGrid(b) {
    this.grid = b;
  }

  onClick(moduleType: E_MODULETYPE) {
    switch(moduleType)
    {
      case E_MODULETYPE.Sales:
        this.onSales();
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
