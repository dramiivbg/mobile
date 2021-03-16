import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class InterceptService {

  // Observable string sources
  private routeMenuAnnouncedSource = new Subject<string>();
  private routeMenuConfirmedSource = new Subject<string>();
  private showMenuSource = new Subject<boolean>();
  private newMenuSource = new Subject<any>();
  private searchShowSource = new Subject<any>();
  private loadingSource = new Subject<boolean>();
  private alertSource = new Subject<boolean>();

  // Observable string streams
  routeMenuAnnounced$ = this.routeMenuAnnouncedSource.asObservable();
  routeMenuConfirmed$ = this.routeMenuConfirmedSource.asObservable();
  showMenu$ = this.showMenuSource.asObservable();
  newMenu$ = this.newMenuSource.asObservable();
  searchShow$ = this.searchShowSource.asObservable();
  loading$ = this.loadingSource.asObservable();
  alert$ = this.alertSource.asObservable();

  // Service message commands
  announceRouteMenu(data: string) {
    this.routeMenuAnnouncedSource.next(data);
  }

  confirmRouteMenu(data: string) {
    this.routeMenuConfirmedSource.next(data);
  }

  showMenuFuc(bool: boolean) {
    this.showMenuSource.next(bool);
  }

  // Show menu with options ({obj: menu|pages|show})
  modifyMenu(menu: any) {
    this.newMenuSource.next(menu);
  }

  // Get search function and return get search object function.
  searchShowFunc(obj: any) {
    this.searchShowSource.next(obj);
  }

  // Loading window is added (bool: true|false)
  loadingFunc(bool: boolean) {
    this.loadingSource.next(bool);
  }

  // load alerts or confirms. 
  // structure:
  // obj: {
  //   type: 'confirm', (confirm|alert|success|error)
  //   func: () => {
  //     you function to execure.
  //   },
  //   title: 'title of alert',
  //   desc: 'description'
  // }
  alertFunc(obj: any) {
    console.log(obj);
    this.alertSource.next(obj);
  }

}
