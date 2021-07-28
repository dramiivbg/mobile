import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { CapacitorDataStorageSqlite, capOpenStorageOptions} from 'capacitor-data-storage-sqlite';


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
    this.platform = Capacitor.getPlatform();
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
    } as capOpenStorageOptions;
  }

  /**
   * Open a Database
   * @returns boolean
   */
  async openStore() : Promise<boolean> {
    if (this.isService) {
      await this.store.openStore(this.storageOptions);
      return Promise.resolve(true);
    } else {
      return Promise.resolve(false);
    }
  }

  async closeStore(): Promise<void> {
    if(this.isService && this.store != null) {
      try {
        await this.store.closeStore({database: this.storageOptions.database});
        return Promise.resolve();
      } catch (err) {
        return Promise.reject(err);
      }      
    } else {
      return Promise.reject(new Error("close: Store not opened"));
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
   * gwet all keys
   * @returns
   */
  async getAllKeysValues(): Promise<Array<any>> {
    try {
      if(this.isService) {
        const {keysvalues} = await this.store.keysvalues();
        return keysvalues;
      } else {
        return null;
      } 
    } catch (error) {
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
