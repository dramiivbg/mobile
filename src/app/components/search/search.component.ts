import { computeMsgId } from '@angular/compiler';
import { compilePipeFromRender2 } from '@angular/compiler/src/render3/r3_pipe_compiler';
import { CONTEXT_NAME } from '@angular/compiler/src/render3/view/util';
import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Platform } from '@ionic/angular';

// import services
import { GeneralService } from '@svc/general.service';
import { InterceptService } from '@svc/intercept.service';
import { JsonService } from '@svc/json.service';
import { SyncerpService } from '@svc/syncerp.service';

@Component({
  selector: 'btn-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  private obj: any = {};
  searchObj: any = {};
  listsFilter: Array<any> = [];
  lists: Array<any> = [];
  process: any = {};
  height: Number;
  // type: Number = 0; // 0. Standar - 1. Sales Orders

  constructor(
    private platform: Platform,
    private syncerp: SyncerpService,
    private general: GeneralService,
    private router: Router,
    private intServ: InterceptService,
    private js: JsonService,
  ) {
    platform.ready().then(
      () => {
        let height = platform.height();
        height = height - 112;
        this.height = height;
      }
    )
    intServ.searchShow$.subscribe(
      obj => {
        this.searchObj = obj;
        this.listsFilter = obj.data;
        this.lists = obj.data;
        this.process = this.searchObj.process
      }
    )
  }

  ngOnInit() {}

  onChange(e) {
    let val = e.target.value;
    if (val === '') {
      this.listsFilter = this.lists;
    } else {
      this.listsFilter = this.lists.filter(
        x => {
          return (x.value.toLowerCase().includes(val.toLowerCase()) || (x.id.toLowerCase().includes(val.toLowerCase())));
        }
      )
    } 
  }

  onBack() {
    this.searchObj = {};
  }

  onClick(item) {
    this.searchObj.func(item);
    if (this.searchObj.clear) this.onBack();
  }

  // Start Sales Orders

  async getCustomers() : Promise<any> {
    return new Promise(
      async (resolve, reject) => {
        let process = await this.syncerp.processRequest('GetCustomers', "10", "", "");
        let customers = await this.syncerp.setRequest(process);
        let customersArray = await this.general.customerList(customers.Customers);
        resolve(customersArray);
      }
    )
    
  }

  async onAddSalesOrder() {
    this.intServ.loadingFunc(true);
    let obj = this.general.structSearch(await this.getCustomers(), 'Search customers', 'Customers', (customer) => {
      let navigationExtras: NavigationExtras = {
        state: {
          customer,
          process: this.process,
          new: true
        }
      };
      this.router.navigate(['sales/sales-form'], navigationExtras);
    });
    this.searchObj = obj;
    this.listsFilter = obj.data;
    this.lists = obj.data;
    this.intServ.loadingFunc(false);
  }

  async onDeleteLine(sell, i) {
    this.intServ.alertFunc(this.js.getAlert('confirm', 'Confirm', `Do you want to delete item No. ${sell.id}?`, 
      async () =>{
        let type = '';
        switch(sell.fields.DocumentType){
          case 'Order':
            type = 'Sales Order';
            break;
          case 'Invoice':
            type = 'Sales Invoice';
            break;
          case 'Credit Memo':
            type = 'Sales Credit Memo';
            break;
          case 'Return Order':
            type = 'Sales Return Order';
            break;
        } 
        let process = await this.syncerp.processRequestParams('DeleteDocument', [{ documentType: type, documentNo: sell.id, salesPerson: "CA" }]);
        let dropOrder = await this.syncerp.setRequest(process);
        this.intServ.alertFunc(this.js.getAlert('success', 'Success', dropOrder.SalesOrders,
          () => {
            this.listsFilter.splice(i, 1);
          }
        ));
      }
    ));
  }

  // End Sales Orders

}
