import { computeMsgId } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { JsonService } from '@svc/json.service';
import { copyFileSync } from 'fs';

// import services
import { ApiService } from '@svc/api.service';
import { AuthService } from '@svc/auth.service';

// import vars
import { E_MODULETYPE } from '@var/enums';

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
  modules: Array<Module> = [];  
  environment: any = {};
  
  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  async ngOnInit() {
    this.authService.getUserSession()
    .then(
      res => {        
        this.environment = res.environment;
        this.environment.modules.forEach((module: any) => {
          let moduleType: E_MODULETYPE = module.moduleType;          
          this.modules.push({            
            description: module.description,
            icon: E_MODULETYPE[moduleType].toLowerCase(),
            moduleType: moduleType
          });          
        });
      }
    );    
  }  

  onGrid(b: boolean) {
    this.grid = b;
  }

  onClick(moduleType: E_MODULETYPE) {

    let module = this.environment.modules.find((mod: any) => mod.moduleType === moduleType );    

    switch(moduleType)
    {
      case E_MODULETYPE.Sales:
        this.onSales(module);
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
    console.log(module);    
    let navigationExtras: NavigationExtras = {
      state: {
        module
      }
    };
    this.router.navigate(['sales/sales-main'], navigationExtras);    
  }

}
