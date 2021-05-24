import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

// import vars
import { SK_SELECTED_MODULE, SK_SELECTED_PROCESS } from '@var/consts';
import { E_MODULETYPE } from '@var/enums';
import { Module, Process } from '@mdl/module';

@Injectable({
  providedIn: 'root'
})
export class ModuleService {
  private selectedProcess: Process;
  private selectedModule: Module;

  constructor(private storage: Storage) { 
    this.initSelectedModule();
    this.initSelectedProcess();
  }

  async initSelectedModule() {
    await this.storage.get(SK_SELECTED_MODULE).then(
     res => {
        this.selectedModule = JSON.parse(res);
      }
    )
  }

  async initSelectedProcess() {
    this.selectedProcess = JSON.parse(await this.storage.get(SK_SELECTED_PROCESS));
  }

  /**
   * set module
   * @param module 
   */
  async setSelectedModule(module: Module) : Promise<void> {
    await this.storage.set(SK_SELECTED_MODULE, JSON.stringify(module));
    await this.initSelectedModule();
  }

  /**
   * get module
   */
  getSelectedModule(): Module {
    return this.selectedModule;
  }

  async setSelectedProcess(process: any): Promise<void> {
    await this.storage.set(SK_SELECTED_PROCESS, JSON.stringify(process));
    await this.initSelectedProcess();
  }

  getSelectedProcess(): Process {
    return this.selectedProcess;
  }

}
