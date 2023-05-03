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
  private avatarSource = new Subject<any>();
  private stripePaySource = new Subject<any>();
  private appBackSource = new Subject<any>();
  private changeCompanySource = new Subject<any>();
  private notifySource = new Subject<any>();
  private showFoouterSource = new Subject<boolean>();
  private updateSalesSource = new Subject<any>();

  // Observable string streams
  public routeMenuAnnounced$ = this.routeMenuAnnouncedSource.asObservable();
  public routeMenuConfirmed$ = this.routeMenuConfirmedSource.asObservable();
  public showMenu$ = this.showMenuSource.asObservable();
  public newMenu$ = this.newMenuSource.asObservable();
  public searchShow$ = this.searchShowSource.asObservable();
  public loading$ = this.loadingSource.asObservable();
  public alert$ = this.alertSource.asObservable();
  public avatar$ = this.avatarSource.asObservable();
  public stripePay$ = this.stripePaySource.asObservable();
  public appBack$ = this.appBackSource.asObservable();
  public changeCompany$ = this.changeCompanySource.asObservable();
  public notify$ = this.notifySource.asObservable();
  public showFooter$ = this.showFoouterSource.asObservable();
  public updateSalesSource$ = this.updateSalesSource.asObservable();

  // Service message commands
  public announceRouteMenu(data: string) {
    this.routeMenuAnnouncedSource.next(data);
  }

  public avatarFuntion(data: any) {
    this.avatarSource.next(data);
  }

  public confirmRouteMenu(data: string) {
    this.routeMenuConfirmedSource.next(data);
  }

  public showMenuFuc(bool: boolean) {
    this.showMenuSource.next(bool);
  }

  // Show menu with options ({obj: menu|pages|show})
  public modifyMenu(menu: any) {
    this.newMenuSource.next(menu);
  }

  // Get search function and return get search object function.
  public searchShowFunc(obj: any) {
    this.searchShowSource.next(obj);
  }

  // Loading window is added (bool: true|false)
  public loadingFunc(bool: boolean) {
    this.loadingSource.next(bool);
  }

  /**
   * load alerts or confirms.
   * 
   * @param obj obj: {
   *  type: 'confirm', (confirm|alert|success|error)
   *  func: () => {
   *     you function to execure.
   *  },
   *  title: 'title of alert',
   *  desc: 'description'
   * }
   */
   public alertFunc(obj: any) {
    this.alertSource.next(obj);
  }

  public stripePayFunc(obj: any) {
    this.stripePaySource.next(obj);
  }

  public appBackFunc(obj: any) {
    this.appBackSource.next(obj);
  }

  public changeCompanyFunc(obj: any) {
    this.changeCompanySource.next(obj);
  }

  public notifyFunc(obj: any) {
    this.notifySource.next(obj);
  }

  public showFooter(bool: boolean) {
    this.showFoouterSource.next(bool);
  }

  /**
   * get sales
   * @param obj 
   */
  public updateSalesFunc() {
    this.updateSalesSource.next('');
  }

}
