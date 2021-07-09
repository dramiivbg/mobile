import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

// import services
import { ApiService } from '@svc/api.service';
import { AuthService } from '@svc/auth.service';
import { InterceptService } from '@svc/intercept.service';
import { JsonService } from '@svc/json.service';

// import vars
import { SK_SELECTED_COMPANY, SK_USER_SESSION } from '@var/consts';

import { Plugins } from '@capacitor/core';
const { App } = Plugins;

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
    private apiService: ApiService,
    private intServ: InterceptService,
    private authService: AuthService,
    private jsonServ: JsonService,
    private router: Router
  ) {
    let objFunc = {
      func: () => {
        this.onBack();
      }
    };
    this.intServ.appBackFunc(objFunc);
  }

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
        console.log(this.userSession.environment.companies);
        this.otherCompanies = this.userSession.environment.companies.filter((c: any) => c.companyId != this.selectedCompany.companyId);
      }
    )
  }

  async onSyncCompanies() {
    this.intServ.loadingFunc(true);
    let data = {
      customerId: this.userSession.customerId,
      mobileUserId: this.userSession.userId,
      environmentId: this.userSession.environment.environmentId
    }
    await this.apiService.postData('mobileuser', 'getenvironment', data).then(
      res => {
        this.userSession.environment = res;
        this.authService.saveUserSession(this.userSession);
        this.init();
        this.intServ.loadingFunc(false);
      }
    )
  }

  /**
   * Return to the modules.
   */
   onBack() {
    this.router.navigate(['modules']);
  }

  onChangeCompany(company: any) {
    this.intServ.alertFunc(this.jsonServ.getAlert('confirm', 'Confirm', `Do you want to change company ${company.companyName}?`,
      () => {
        console.log(company);
        this.intServ.loadingFunc(true);
        this.storage.set(SK_SELECTED_COMPANY, JSON.stringify(company)).then(
          res => {
            this.intServ.loadingFunc(false);
          }
        ).catch(
          err => {
            this.intServ.loadingFunc(false);
          }
        )
      })
    );
  }

}
