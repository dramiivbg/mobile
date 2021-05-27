import { Component, OnInit } from '@angular/core';
import { OfflineService } from '@svc/offline.service';

@Component({
  selector: 'app-sync',
  templateUrl: './sync.page.html',
  styleUrls: ['./sync.page.scss'],
})
export class SyncPage implements OnInit {

  constructor(
    private offLine: OfflineService
  ) { }

  ngOnInit() {
  }

  async onSyncTables() : Promise<void> {
    let b = await this.offLine.sycnAll();
  }

}
