import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

// import vars
import { SK_SELECTED_MODULE, SK_SELECTED_PROCESS } from '@var/consts';
import { Module, Process } from '@mdl/module';
import { timingSafeEqual } from 'crypto';

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

  public async initSelectedModule() {
    let res = await this.storage.get(SK_SELECTED_MODULE);
    this.selectedModule = JSON.parse(res);
  }

  public async initSelectedProcess() {
    this.selectedProcess = JSON.parse(await this.storage.get(SK_SELECTED_PROCESS));
  }

  /**
   * set module
   * @param module 
   */
   public async setSelectedModule(module: Module) : Promise<void> {
    await this.storage.set(SK_SELECTED_MODULE, JSON.stringify(module));
    await this.initSelectedModule();
  }

  /**
   * get module
   */
  public async getSelectedModule(): Promise<Module> {
    if (this.selectedModule === undefined) {
      await this.initSelectedModule();
    }
    return this.selectedModule;
  }

  public async setSelectedProcess(process: any): Promise<void> {
    await this.storage.set(SK_SELECTED_PROCESS, JSON.stringify(process));
    await this.initSelectedProcess();
  }

  public async getSelectedProcess(): Promise<Process> {
    if (this.selectedProcess === undefined) {
      await this.initSelectedProcess();
    }
    return this.selectedProcess;
  }

}
