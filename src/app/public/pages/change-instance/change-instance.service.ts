import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChangeInstanceService {

  constructor() { }

  resetClic(): Promise<number> {
    return new Promise(resolve => {
      setTimeout(() => {       
        resolve(0);
      }, 2000);
    });
  }
}
