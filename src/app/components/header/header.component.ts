import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { InterceptService } from '@svc/intercept.service';
import { NotifyService } from '@svc/notify.service';
import { SK_ENVIRONMENT } from '@var/consts';
import { E_MENUTYPE } from '@var/enums';

@Component({
  selector: 'PlureHeader',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  public envShort: string = '';
  public notifyCount: number = 0;
  @Input() type: E_MENUTYPE;
  @Input() url: string;
  @Input() title: string;
  @Input() notify: string;
  @Input() getObjFunc: any;

  constructor(private storage: Storage
    , private router: Router
    , private intServ: InterceptService
    , private notifyService: NotifyService
  ) { 
      intServ.notify$.subscribe(
        rsl => {
          this.getNotifies();
        }
      )
  }

  ngOnInit() {
    this.onEnvironment();
    this.getNotifies();
  }

  public async getNotifies() {
    let not = await this.notifyService.getNotifications();
    if (not !== undefined && not !== null){
      if (not.length > 0) {
        let notNew = not.filter(x => {
          return (x.new === true);
        })
        this.notifyCount = notNew.length;
      } else {
        this.notifyCount = 0;
      }
    }
  }

  onEvent() {
    if (this.url !== 'none'){
      this.router.navigate([this.url], {replaceUrl: true});
    } else {
      this.getObjFunc.func();
    }
  }

  async onEnvironment() {
    let environment = await this.storage.get(SK_ENVIRONMENT);
    if (environment === 'DEV') this.envShort = environment;
    if (environment === 'TEST') this.envShort = environment;
  }

  /**
   * Notifications - modal
   */
  public async onShowNotify() {
    let obj = {
      Notify: true
    };
    await this.notifyService.changeNotifications();
    this.intServ.notifyFunc(obj);
  }

  createfunc() {
    console.log(1);
  }

}
