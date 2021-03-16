import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { InterceptService } from 'src/app/services/intercept.service';
import { JsonService } from 'src/app/services/json.service';
import { SqlitePlureService } from 'src/app/services/sqlite-plure.service';

@Component({
  selector: 'app-enviroments',
  templateUrl: './enviroments.page.html'
})
export class EnviromentsPage implements OnInit {
  frm: FormGroup;

  constructor(
    private intServ: InterceptService
    , private apiConnect: ApiService
    , private formBuilder: FormBuilder
    , private jsonServ: JsonService
    , private router: Router
    , private sqlLite: SqlitePlureService
  ) { 
    this.frm = this.formBuilder.group(
      {
        CustomerId: ['', Validators.required]
      }
    );
  }

  ngOnInit() {
    if ( localStorage.getItem('SessionCustomerId') !== null ) {
      this.router.navigateByUrl('login');
    }

    this.sqlLite.onTest();
  }

  onSubmit() {
    this.intServ.loadingFunc(true);
    if ( this.frm.valid ) {
      this.jsonServ.formToJson(this.frm).then(
        formJson => {
          this.apiConnect.getData('mobile', `getenvironments/${formJson.CustomerId}`)
          .then(
            get => {
              this.intServ.loadingFunc(false);
              if ( get.length > 0 ) {
                let txtEnviroment = get.length === 1 ? 'environment' : 'environments';
                localStorage.setItem('SessionCustomerId', formJson.CustomerId);
                this.intServ.alertFunc(this.jsonServ.getAlert(
                  'success', 'Success', 
                  `You customerId '${this.frm.controls.CustomerId.value}' has ${get.length} ${txtEnviroment}.`,
                  () => {
                    this.router.navigateByUrl('login');
                  }));
              } else {
                this.intServ.alertFunc(this.jsonServ.getAlert('alert', 'Alert', `You customerId '${this.frm.controls.CustomerId.value}' is not found.`));
              }
            }
          )
          .catch(error => {
            this.intServ.alertFunc(this.jsonServ.getAlert('alert', 'Error', `${JSON.stringify(error)}`));
            this.intServ.loadingFunc(false);
          });
        }
      )
    } else {
      this.intServ.alertFunc(this.jsonServ.getAlert('alert', 'Alert', `You customerId '${this.frm.controls.CustomerId.value}' is not found.`));
      this.intServ.loadingFunc(false);
    }
  }

}
