import { computeMsgId } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { JsonService } from '@svc/json.service';
import { copyFileSync } from 'fs';
import { __awaiter } from 'tslib';

// import services
import { ApiService } from '@svc/api.service';
import { SqlitePlureService } from '@svc/sqlite-plure.service';
import { AuthService } from '@svc/auth.service';
import { ModuleService } from '@svc/gui/module.service';

// import vars
import { E_MODULETYPE } from '@var/enums';
import { timeStamp } from 'console';

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
  
  constructor(private router: Router,
    private sqLite: SqlitePlureService,
    private authService: AuthService,
    private moduleService: ModuleService) { }

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
        // this.environment.modules.forEach((module: any) => {
        //   let moduleType: E_MODULETYPE = module.moduleType;
          
        //   this.modules.push({            
        //     description: module.description,
        //     icon: E_MODULETYPE[moduleType].toLowerCase(),
        //     moduleType: moduleType
        //   });          
        // });
      }
    );    
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
