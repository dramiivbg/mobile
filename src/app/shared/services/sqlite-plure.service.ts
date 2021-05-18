import { Injectable, OnInit } from '@angular/core';
import { Device } from '@capacitor/core';
import { CapacitorDataStorageSqlite, capDataStorageOptions, capDataStorageResult, capOpenStorageOptions } from 'capacitor-data-storage-sqlite';

@Injectable()
export class SqlitePlureService {
  private platform: string;
  private isService: boolean = false;
  private store: any;
  private storageOptions: any;

  // openStorageOptions: capOpenStorageOptions = {
  //   database: 'plure_app',
  //   table: 'erp'
  // };

  constructor() {}

  /**
   * Plugin Initialization
   */
  async init(): Promise<void> {
    const info = await Device.getInfo();
    this.platform = info.platform;
    this.store = CapacitorDataStorageSqlite;
    this.isService = true;
  }

  /**
   * Open a Storage
   * @param _dbName string optional
   * @param _table string optional
   * @param _encrypted boolean optional 
   * @param _mode string optional
   */  
  async openStorageOptions(_dbName?: string, _dbTable?: string, _encrypt?: boolean, _mode?: string) : Promise<void> {
    this.storageOptions = {
      database: _dbName ? _dbName : '_dbPlure',
      table: _dbTable ? _dbTable : '_plureStorage',
      encrypted: _encrypt ? _encrypt : false,
      mode: _mode ? _mode : 'no-encryption'
    }
  }

  /**
   * Open a Database
   * @returns boolean
   */
  async openStore() : Promise<boolean> {
    if (this.isService) {
      const {result} = await this.store.openStore(this.storageOptions);
      return result;
    } else {
      return Promise.resolve(false);
    }
  }

  /**
   * Create/Set a Table
   * @param table string
   */  
  async setTable(table) : Promise<any> {
    if (this.isService) {
      const {result,message} = await this.store.setTable({table});
      return Promise.resolve([result, message]);
    } else {
      return Promise.resolve({result:false, message:"Service is not initialized"});
    }
  }

   /**
   * Set of Key
   * @param key string 
   * @param value string
   */
  async setItem(key: string, value: string) : Promise<void> {
    if (this.isService && key.length > 0) {
      await this.store.set({key, value});
    }
  }

   /**
   * Get the Value for a given Key
   * @param key string 
   */
  async getItem(key: string) : Promise<string> {
    if(this.isService && key.length > 0) {
      const {value} = await this.store.get({ key });
      return value;
    } else {
      return null;
    }
  }

  /**
   * Remove the Value for a given Key
   * @param key string 
   */
  async removeItem(key:string): Promise<boolean> {
    if(this.isService && key.length > 0) {
      const {result} = await this.store.remove({ key });
      return result;
    } else {
      return null;
    }
  }
}
