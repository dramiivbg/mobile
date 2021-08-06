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
  public notifies: any = [];
  public Notify: boolean = false;

  constructor(private intServ: InterceptService
    , private notify: NotifyService
  ) {
    intServ.notify$.subscribe(
      rsl => {
        if (rsl !== undefined && rsl !== null) {
          this.Notify = rsl.Notify;
          this.getNotifies();
        }
      }
    )
  }

  ngOnInit() {}

  async getNotifies() {
    this.notifies = await this.notify.getNotifications();
    console.log(this.notifies);
  }

}
