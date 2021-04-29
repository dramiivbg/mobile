import { Injectable, OnInit } from '@angular/core';
import { CapacitorDataStorageSqlite, capDataStorageOptions, capDataStorageResult, capOpenStorageOptions } from 'capacitor-data-storage-sqlite';

@Injectable()
export class SqlitePlureService implements OnInit {

  openStorageOptions: capOpenStorageOptions = {
    database: 'plure_app',
    table: 'erp'
  };

  constructor() { 

  }

  async ngOnInit() {
    
  }

  async onTest(){
    const openResult: capDataStorageResult = await CapacitorDataStorageSqlite.openStore(this.openStorageOptions);

    if(openResult.result) {
      const dataStorageOptions: capDataStorageOptions = {
        key: 'Login',
        value: 'Juancho'
      };

      const dataStorageOptions2: capDataStorageOptions = {
        key: 'Password',
        value: 'Juancho2'
      };

      const dataStorageOptions3: capDataStorageOptions = {
        key: 'nombre'
      };

      const result = CapacitorDataStorageSqlite.set(dataStorageOptions);
      const result2 = CapacitorDataStorageSqlite.set(dataStorageOptions2);
      let lrr = CapacitorDataStorageSqlite.get(dataStorageOptions3);
      console.log(lrr); // true
    }
  }
}
