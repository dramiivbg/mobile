import { getLocaleMonthNames } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { InterceptService } from 'src/app/services/intercept.service';
import { JsonService } from 'src/app/services/json.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html'
})
export class LoginPage implements OnInit {
  frm: FormGroup;
  public environments: Array<any> = [];

  constructor(
    private intServ: InterceptService,
    private apiConnect: ApiService,
    private formBuilder: FormBuilder,
    private jsonServ: JsonService,
    private router: Router    
  ) { 
    intServ.modifyMenu({menu: [], showMenu: false});
    this.frm = this.formBuilder.group(
      {
        EnviromentId: ['', Validators.required],
        User: ['', Validators.required],
        Password: ['', Validators.required],
      }
    )
  }

  ngOnInit() {
    let sessionCustomerId = localStorage.getItem('SessionCustomerId');
    if ( sessionCustomerId === null ) {
      this.router.navigateByUrl('enviroments');
    } else {
      this.apiConnect.getData('mobile', `getenvironments/${sessionCustomerId}`)
      .then(
        get => {
          if ( get.length > 0 ) {
            this.environments = get;
          } else {
            this.intServ.alertFunc(this.jsonServ.getAlert('alert', 'Alert', `No response from the server.`));
          }
        }
      )
      .catch(error => {
        this.intServ.alertFunc(this.jsonServ.getAlert('alert', 'Error', `${JSON.stringify(error)}`));
        this.intServ.loadingFunc(false);
      });
    }
  }

  // login to the application is performed.
  onSubmit() {
    this.intServ.loadingFunc(true);
    if (this.frm.valid) {
      this.jsonServ.formToJson(this.frm).then(
        json => {
          this.apiConnect.postData('loginuser', 'authentication', json).then(
            rsl => {
              if ( rsl.token != null ) {
                localStorage.setItem("SessionLogin", JSON.stringify(rsl));
                this.intServ.alertFunc(this.jsonServ.getAlert(
                  'success', 
                  'Success', 
                  `The entry was successful.`,
                  () => {
                    this.intServ.loadingFunc(false);
                    this.router.navigateByUrl('init/home');
                  })
                );
              } else {
                this.intServ.alertFunc(this.jsonServ.getAlert(
                  'alert', 
                  'Error', 
                  `The user or password is not correct.`,
                  () => {
                    this.intServ.loadingFunc(false);
                  })
                );
              }
            }
          )
          .catch(
            error => {
              this.intServ.alertFunc(this.jsonServ.getAlert(
                'alert', 
                'Error', 
                `${JSON.stringify(error)}`,
                () => {
                  this.intServ.loadingFunc(false);
                })
              );
            }
          );
        }
      )
    } else {
      this.intServ.alertFunc(this.jsonServ.getAlert(
        'alert', 
        'Error', 
        'plase fill fields.'
      ));
      this.intServ.loadingFunc(false);
    }
  }

  // Test
  onCallMethods(obj: any) {
    let o: any = {
      returnUrl: 'http://192.168.39.146:8100/login',
      customerId: obj.customerId
    }
    this.apiConnect.postData('customers', 'getcustomerportal', o).then(
      rsl => {
        console.log(rsl);
      }
    );
  }

  // remove environment with confirm
  onRemoveEnvironment() {
    this.intServ.alertFunc(this.jsonServ.getAlert(
      'confirm', 
      'Confirm', 
      `Do you want to change company ?`,
      () => {
        localStorage.removeItem('SessionCustomerId');
        this.router.navigateByUrl('enviroments');
      })
    );
  }

  onTest() {
    let obj = {
      type: 'confirm',
      func: () => {
        alert('Execute the alert with Yes in confirmation.');
      },
      title: 'Alert for test',
      desc: 'this is an alert for test this window'
    }
    this.intServ.alertFunc(obj);
  }

}
