import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { InterceptService } from '@svc/intercept.service';
import { JsonService } from '@svc/json.service';
import { SK_ENVIRONMENT } from '@var/consts';

@Component({
  selector: 'app-change-instance',
  templateUrl: './change-instance.page.html',
  styleUrls: ['./change-instance.page.scss'],
})
export class ChangeInstancePage implements OnInit {

  constructor(private modalController: ModalController    
    , private storage: Storage) { }

  ngOnInit() {
  }

  dismissChangeInstanceModal() {
    this.modalController.dismiss();
  }

  async onChangeInstance(instance: string) {
    await this.storage.set(SK_ENVIRONMENT, instance);
    this.dismissChangeInstanceModal();    
  }

}
