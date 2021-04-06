import { ThrowStmt } from '@angular/compiler';
import { typeWithParameters } from '@angular/compiler/src/render3/util';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { ApiService } from 'src/app/services/api.service';
import { InterceptService } from 'src/app/services/intercept.service';
import { JsonService } from 'src/app/services/json.service';
import { SqlitePlureService } from 'src/app/services/sqlite-plure.service';

@Component({
  selector: 'app-enviroments',
  templateUrl: './environments.page.html',
  styleUrls: ['./environments.page.scss']
})
export class EnvironmentsPage implements OnInit {
  frm: FormGroup;

  constructor(
    private intServ: InterceptService
    , private apiConnect: ApiService
    , private formBuilder: FormBuilder
    , private jsonServ: JsonService
    , private router: Router
    , private sqlLite: SqlitePlureService
    , private storage: Storage
  ) { 
    this.frm = this.formBuilder.group(
      {
        CustomerId: ['', Validators.required]
      }
    );
  }

  ngOnInit() { }

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
                this.storage.set('SESSION_CUSTOMER_ID', formJson.CustomerId);
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
