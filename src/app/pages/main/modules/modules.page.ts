import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ApiService } from '@svc/api.service';

@Component({
  selector: 'app-modules',
  templateUrl: './modules.page.html',
  styleUrls: ['./modules.page.scss'],
})
export class ModulesPage implements OnInit {
  grid: boolean = false;
  
  constructor(private router: Router,
    private apiConnect: ApiService
  ) { }

  ngOnInit() {
  }

  onGrid(b) {
    this.grid = b;
  }

  onSales() {
    //this.router.navigate(['sales/sales-main']);
    this.onTest();
  }


  onTest()
  {
    let data = {
      customerId: "cus_JKL02gDkbYz0sG",
      environmentId: "env_70767ef6d2f8417e8594e375d5e81634",
      processMethod: "GetSalesOrders",
      userId: "mob_5fe9450c26fe4176b5856afa9663fcbc",
      company:
      {
          companyId: "6138faaf-a208-eb11-bbf6-000d3a042aab",
          companyName: "MS Cloud Experts, LLC",
          apiPage: "0c705e10-5d96-41fc-b281-a1539cc77ac2",
          active: true,
          default: true
      },
      jsonRequest: "{\"ProcessMethod\":\"GetSalesOrders\",\"Parameters\":[{\"type\":\"sales order\",\"pageSize\":\"\",\"position\":\"\",\"salesPerson\":\"CA\"}]}"
    }

    this.apiConnect.postData('erp', 'processrequest', data).then(
      res => {
        console.log(res);                  
      })
      .catch(
        err => {
          console.log(err);          
        }
      );
  }

}
