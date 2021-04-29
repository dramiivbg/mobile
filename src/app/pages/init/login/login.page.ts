import { getLocaleMonthNames } from '@angular/common';
import { CommentStmt } from '@angular/compiler';
import { CloneVisitor } from '@angular/compiler/src/i18n/i18n_ast';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { ApiService } from 'src/app/services/api.service';
import { InterceptService } from 'src/app/services/intercept.service';
import { JsonService } from 'src/app/services/json.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {
  private scid: string; // Session Customer Id
  frm: FormGroup;
  public environments: Array<any> = [];

  constructor(
    private intServ: InterceptService,
    private apiConnect: ApiService,
    private formBuilder: FormBuilder,
    private jsonServ: JsonService,
    private router: Router,
    private storage: Storage
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
    this.storage.get('SESSION_CUSTOMER_ID').then(
      val => {
        this.scid = val;
        this.onGetEnvironments();
      }
    );
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
                this.storage.set('SESSION_LOGIN', JSON.stringify(rsl));
                this.intServ.alertFunc(this.jsonServ.getAlert(
                  'success', 
                  'Success', 
                  `The entry was successful.`,
                  () => {
                    this.intServ.loadingFunc(false);
                    this.router.navigateByUrl('modules');
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
  
  // remove environment with confirm
  onRemoveEnvironment() {
    this.intServ.alertFunc(this.jsonServ.getAlert(
      'confirm', 
      'Confirm', 
      `Do you want to change company ?`,
      () => {
        this.storage.remove('SESSION_CUSTOMER_ID');
        this.router.navigateByUrl('enviroments');
      })
    );
  }

  onGetEnvironments() {
    this.apiConnect.getData('mobile', `getenvironments/${this.scid}`)
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
