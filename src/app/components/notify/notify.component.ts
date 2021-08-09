import { Component, OnInit } from '@angular/core';

// Services
import { InterceptService } from '@svc/intercept.service';
import { NotifyService } from '@svc/notify.service';

@Component({
  selector: 'notify-plure',
  templateUrl: './notify.component.html',
  styleUrls: ['./notify.component.scss'],
})
export class NotifyComponent implements OnInit {
  private timeNotif = 20000;
  public notifies: any = [];
  public Notify: boolean = false;

  constructor(private intServ: InterceptService
    , private notify: NotifyService
  ) {
    intServ.notify$.subscribe(
      rsl => {
        if (rsl !== undefined && rsl !== null) {
          this.Notify = rsl.Notify;
        }
        this.getNotifies();
      }
    )
  }

  ngOnInit() {
    this.refreshNotify();
  }

  onClose() {
    this.Notify = false;
  }

  async getNotifies() {
    let notifies = []
    let not = await this.notify.getNotifications();
    for(let i = 0; i < 9; i++) {
      if(not[i] === undefined) break;
      notifies.push(not[i]);
    } 
    this.notifies = notifies;
  }

  refreshNotify() {
    this.getNotifies();
    setTimeout(() => {
      this.refreshNotify();
    }, this.timeNotif);
  }

}
