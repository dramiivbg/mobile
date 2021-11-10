import { Component, OnInit } from '@angular/core';
import { Stripe as StripeNgx } from '@ionic-native/stripe/ngx';
declare var Stripe;

import { InterceptService } from '@svc/intercept.service';
import { JsonService } from '@svc/json.service';

import { ApiService } from '@svc/api.service';
import { SalesService } from '@svc/Sales.service';
import { UserService } from '@svc/user.service';
import { ICustomer } from '@mdl/customer';

@Component({
  selector: 'stripe-pay',
  templateUrl: './stripe-pay.component.html',
  styleUrls: ['./stripe-pay.component.scss'],
})
export class StripePayComponent implements OnInit {
  private isEnabled: boolean = true;
  private stripe: any;
  public card: any = {};
  public showStripePay: boolean = false;
  public chargeOptions: any = {};

  constructor(private intServ: InterceptService
    , private apiService: ApiService
    , private js: JsonService
    , private salesService: SalesService
    , private userService: UserService
  ) {
    this.intServ.stripePay$.subscribe(
      (req: any) => {
        if (!this.isEnabled) {
          this.intServ.alertFunc(this.js.getAlert('error', 'Error', 'You have an error in the stripe configuration, you can see the posted invoices but you will not be able to pay them.'));
        } else {
          this.chargeOptions = req;
          this.showStripePay = true;
        }
      }
    )
  }

  public async ngOnInit() {
    try {
      let customer = await this.userService.getCustomer();
      let c: ICustomer = await this.apiService.getData('customers', `getcustomer/${customer.customerId}`);
      this.stripe = Stripe(c.stripeSettings.publishableKey);
      this.setupStripe(); 
    } catch (error) {
      this.isEnabled = false;
      this.intServ.alertFunc(this.js.getAlert('error', 'Error', 'You have an error in the stripe configuration, you can see the posted invoices but you will not be able to pay them.'));
    }
  }

  public onClose() {
    this.showStripePay = false;
  }

  public setupStripe() {
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

    var form = document.getElementById('payment-form');
    form.addEventListener('submit', event => {
      event.preventDefault();

      this.stripe.createToken(this.card).then((result: any) => {
        this.makePayment(result.token.id);
      });
    });
  }

  /**
   * submit paid
   * @param tokenId 
   */
  public async makePayment(tokenId: string) {
    this.intServ.loadingFunc(true);
    let data = {
      CustomerId: this.chargeOptions.CustomerId,
      TokenId: tokenId,
      Currency: this.chargeOptions.Currency,
      Amount: this.chargeOptions.Amount,
      DocumentNum: this.chargeOptions.DocumentNum
    }
    try {
      let {chargeId} = await this.apiService.postData('mobile', 'paywithstripe', data);
      
      // Start Paid Success
      this.chargeOptions.paidBC.transactionNo = chargeId;
      let {Posted} = await this.salesService.paidPostedSalesInvoices(this.chargeOptions.paidBC);
      if (Posted) {
        this.intServ.alertFunc(this.js.getAlert('success', 'Success', 'Payment was successful'));
        this.cancel();
      }

      // End Paid Success
      
      this.intServ.loadingFunc(false);
    } catch (error) {
      this.intServ.alertFunc(this.js.getAlert('error', 'Error', error.error.message));
      var errorElement = document.getElementById('card-errors');
      errorElement.textContent = error.message;
      this.intServ.loadingFunc(false);
    }
  }

  public async onCancel() {
    this.chargeOptions = {};
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

}
