import { Component, DebugEventListener, OnInit } from '@angular/core';
import { Stripe as StripeNgx } from '@ionic-native/stripe/ngx';
declare var Stripe;

import { InterceptService } from '@svc/intercept.service';
import { JsonService } from '@svc/json.service';

import { ApiService } from '@svc/api.service';
import { SalesService } from '@svc/Sales.service';
import { UserService } from '@svc/user.service';
import { ICustomer } from '@mdl/customer';
import { constants } from 'buffer';
import { Network } from '@capacitor/network';

@Component({
  selector: 'stripe-pay',
  templateUrl: './stripe-pay.component.html',
  styleUrls: ['./stripe-pay.component.scss'],
})
export class StripePayComponent implements OnInit {
  private isEnabled: boolean = true;
  private stripe: any;
  public card: any = {};
  public form: any = {};
  public showStripePay: boolean = false;
  public chargeOptions: any = {};
  public rListener: boolean = false;

  constructor(private intServ: InterceptService
    , private apiService: ApiService
    , private js: JsonService
    , private salesService: SalesService
    , private userService: UserService
  ) {
    this.intServ.stripePay$.subscribe(
      async (req: any) => {
        if (req.CustomerId !== undefined) {
          if (await this.setupMakeStripe()) {
            this.chargeOptions = req;
            this.showStripePay = true;
          }
        }
        if (req.Close !== undefined) {
          this.showStripePay = false;
        }
      }
    )
  }

  public async ngOnInit() {
    await this.setupMakeStripe();
  }

  public onClose() {
    this.showStripePay = false;
  }

  public async setupStripe() {
    let elements = this.stripe.elements();
    var style = {
      base: {
        color: '#32325d',
        lineHeight: '24px',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4'
        }
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a'
      }
    };

    this.removeListener();

    this.card = elements.create('card', { style: style });
    this.card.mount('#card-element');

    this.card.addEventListener('change', event => {
      var displayError = document.getElementById('card-errors');
      if (event.error) {
        displayError.textContent = event.error.message;
      } else {
        displayError.textContent = '';
      }
    });

    this.form = document.getElementById('payment-form');
    this.form.addEventListener('submit', event => {
      event.preventDefault();
      this.intServ.loadingFunc(true);
      try {
        this.stripe.createToken(this.card).then((result: any) => {
          if (result.error === undefined) {
            this.intServ.loadingFunc(false);
            this.makePayment(result.token.id);
          } else {
            this.intServ.alertFunc(this.js.getAlert('error', 'Error', result.error.message));
            throw 'error';
          }
        })
      } catch (error) {
        this.intServ.loadingFunc(false);
      }
    });

    // this.card = elements.create('card', { style: style });
    // this.form = document.getElementById('payment-form');
    // this.card.mount('#card-element');

    // this.card.addEventListener('change', this.cardErrors, true);
    // this.form.addEventListener('submit', this.submitPay,  true);
    this.rListener = true;
  }

  /**
   * submit paid
   * @param tokenId 
   */
  public async makePayment(tokenId: string) {
    let transactionId: string;
    this.intServ.loadingFunc(true);
    let data = {
      CustomerId: this.chargeOptions.CustomerId,
      TokenId: tokenId,
      Currency: this.chargeOptions.Currency,
      Amount: this.chargeOptions.Amount * 100,
      DocumentNum: this.chargeOptions.DocumentNum,
      Description: this.chargeOptions.DocumentNum + ' - ' + this.chargeOptions.CustomerName,
      UserId: this.chargeOptions.UserId,
      ERPUserId: this.chargeOptions.ErpUserId,
      EnvironmentId: this.chargeOptions.EnvironmentId,
      CompanyId: this.chargeOptions.CompanyId,
      UserName: this.chargeOptions.UserName,
      DeviceId: this.chargeOptions.DeviceId,
      CustomerNum: this.chargeOptions.CustomerNo,
      CustomerName: this.chargeOptions.CustomerName,
    }
    try {
      let rsl = await this.apiService.postData('payments', 'authorizePayment', data);
      transactionId = rsl.transactionId;
      
      // Start Paid Success
      this.chargeOptions.paidBC.transactionNo = transactionId;
      
      try {
        let {Posted} = await this.salesService.paidPostedSalesInvoices(this.chargeOptions.paidBC);
        if (Posted) {
          if (this.forceAuthorization(transactionId)) {
            this.intServ.alertFunc(this.js.getAlert('success', 'Success', 'Payment was successful'));
            this.cancel();
          }
        } else {
          let error = {error: { message: 'An error occurred in Business central when performing the payment journal.' } }
          throw error;
        }
      } catch (error) {
        this.cancelAuthorization(transactionId, error.error.message);
        throw error;
      }

      // End Paid Success
      
      this.intServ.loadingFunc(false);
    } catch (error) {
      if (!(await Network.getStatus()).connected) {
        this.intServ.alertFunc(this.js.getAlert('error', 'Error', 'You cannot make this transaction because you do not have internet access.'));
        return false;
      }
      this.intServ.alertFunc(this.js.getAlert('error', 'Error', error.error.message));
      var errorElement = document.getElementById('card-errors');
      errorElement.textContent = error.message;
      this.intServ.loadingFunc(false);
    }
  }

  public async onCancel() {
    this.chargeOptions = {
      close: true
    };
    this.intServ.stripePayFunc(this.chargeOptions);
    this.setupStripe();
    this.onClose();
  }

  private async cancel() {
    this.chargeOptions = {
      reload: true
    };
    this.intServ.stripePayFunc(this.chargeOptions);
    this.setupStripe();
    this.onClose();
  }

  private async forceAuthorization(TransactionId): Promise<boolean> {
    let data = {
      CustomerId: this.chargeOptions.CustomerId,
      TransactionId
    };
    try {
      let rsl = await this.apiService.postData('payments', 'forceAuthorization', data);
      if (rsl.status === 'succeeded') {
        return true;
      }
    } catch (error) { }
    return false;
  }

  private async cancelAuthorization(TransactionId, Reason): Promise<boolean> {
    let data = {
      CustomerId: this.chargeOptions.CustomerId,
      Reason,
      TransactionId
    };
    try {
      let rsl = await this.apiService.postData('payments', 'cancelAuthorization', data);
      if (rsl.status === 'succeeded') {
        return true;
      } 
    } catch (error) { }
    return false;
  }

  private async setupMakeStripe() {
    try {
      let c = await this.getCustomer();
      this.stripe = Stripe(c.stripeSettings.publishableKey);
      this.setupStripe(); 
    } catch (error) {
      this.isEnabled = false;
      this.intServ.alertFunc(this.js.getAlert('error', 'Error', 'You have an error in the stripe configuration, you can see the posted invoices but you will not be able to pay them.'));
      return false;
    }
    return true;
  }

  private async getCustomer(): Promise<ICustomer> {
    try {
      let customer = await this.userService.getCustomer();
      let c: ICustomer = await this.apiService.getData('customers', `getcustomer/${customer.customerId}`);
      return c; 
    } catch (error) {
      this.intServ.alertFunc(this.js.getAlert('error', 'Error', JSON.stringify(error)));
    }
  }

  private removeListener() {
    if (this.rListener) {
      this.card.removeAllListeners();
      this.form.removeAllListeners();
      this.rListener = false;
    }
  }

}
