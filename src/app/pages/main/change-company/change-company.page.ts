import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';

import { ApiService } from '@svc/api.service';

import { SK_AUTHORIZE_ACCESS_CLIENT, SK_SELECTED_COMPANY, SK_USER_SESSION } from '@var/consts';

@Component({
  selector: 'app-change-company',
  templateUrl: './change-company.page.html',
  styleUrls: ['./change-company.page.scss'],
})
export class ChangeCompanyPage implements OnInit {

  userSession: any;
  selectedCompany: any = {}
  otherCompanies: Array<any>;

  constructor(private storage: Storage,
    private apiService: ApiService) { }

  ngOnInit() {
    this.init();
  }

  async init() {
    await this.storage.get(SK_SELECTED_COMPANY).then(
      res => {
        this.selectedCompany = JSON.parse(res);
      }
    );

    await this.storage.get(SK_USER_SESSION).then(
      res => {
        this.userSession = JSON.parse(res);
        this.otherCompanies = this.userSession.environment.companies.filter((c: any) => c.companyId != this.selectedCompany.companyId);
        console.log(this.userSession);
      }
    )
  }

  async onSyncCompanies() {
    let data = {
      customerId: this.userSession.customerId,
      mobileUserId: this.userSession.userId
    }
    await this.apiService.postData('mobileuser', 'getmobileuser', data).then(
      res => {
        console.log(res);
      }
    )
  }

}
