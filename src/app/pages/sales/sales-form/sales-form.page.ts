import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { InterceptService } from 'src/app/services/intercept.service';

@Component({
  selector: 'app-sales-form',
  templateUrl: './sales-form.page.html'
})
export class SalesFormPage implements OnInit {
  public frm = new FormGroup({});
  public orderDate: string = new Date().toDateString();
  public deliveryDate: string = new Date().toDateString();
  public fields: Array<any> = [];

  constructor(
    private apiConnect: ApiService,
    private formBuilder: FormBuilder,
    private interceptService: InterceptService
  ) { 
    this.frm.addControl('shippingName', new FormControl("",Validators.required));
    this.frm.addControl('customerNo', new FormControl("",Validators.required));
    this.frm.addControl('customerName', new FormControl(""));
    this.getMethods();
  }

  ngOnInit() {
    this.onGetFields();
  }

  // get fields
  onGetFields() {
    this.apiConnect.getData('mobile', 'getfields').then(
      rsl => {
        // console.log(rsl);
        this.fields = rsl;
        this.fields.forEach(
          x => {
            if (x.required) {
              this.frm.addControl(x.id,new FormControl("",Validators.required));
            } else {
              this.frm.addControl(x.id,new FormControl(""));
            }
          }
        );
      }
    );
  }

  // load search component
  onCustomer() {
    let obj: any = {
      show: true,
      data: [
        {
          id: 'test1',
          name: 'test 1'
        },
        {
          id: 'test2',
          name: 'test 2'
        },
        {
          id: 'test3',
          name: 'test 3'
        }
      ],
      title: 'Search customer',
      name: 'Customers',
      formControlName: 'customer',
      func: (id, name) => {
        this.frm.controls['customerNo'].setValue(id);
        this.frm.controls['customerName'].setValue(name);
      }
    }
    this.interceptService.searchShowFunc(obj);
  }

  // methods
  getMethods() {
    // get item of the search component.
    // this.interceptService.getSearchObj$.subscribe(
    //   obj => {
    //     switch(obj.formControlName)
    //     {
    //       case 'customer':
    //         this.frm.controls['customerNo'].setValue(obj.item.id);
    //         this.frm.controls['customerName'].setValue(obj.item.name);
    //         break;
    //     }
    //     let objSearch = { show: false, title: '', name: '', data: [] };
    //     this.interceptService.searchShowFunc(objSearch);
    //   }
    // )
  }

}
