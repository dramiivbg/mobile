import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

// import vars
import { SK_SELECTED_MODULE } from '@var/consts';
import { E_MODULETYPE } from '@var/enums';
import { Module } from '@mdl/module';

@Injectable({
  providedIn: 'root'
})
export class ModuleService {

  private selectedModule: Module = { 
    subscriptionId: '',
    moduleId: '',
    description: '',
    moduleType: E_MODULETYPE.None,
    userType: 0,
    erpUserId: '',
    active: true,
    processes: []
  };

  constructor(private storage: Storage) { 
    this.initSelectedModule();
  }

  async initSelectedModule() {
    await this.storage.get(SK_SELECTED_MODULE).then(
     res => {
        this.selectedModule = JSON.parse(res);
      }
    )
  }

  async setSelectedModule(module: Module) : Promise<void> {
    await this.storage.set(SK_SELECTED_MODULE, JSON.stringify(module));
    await this.initSelectedModule();
  }

  getSelectedModule(): Module {
    return this.selectedModule;
  }
}
