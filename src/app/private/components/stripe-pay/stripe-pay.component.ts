import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from '@env/environment';
import { Stripe as StripeNgx, StripeCardTokenRes } from '@ionic-native/stripe/ngx';
declare var Stripe;

import { InterceptService } from '@svc/intercept.service';
import { JsonService } from '@svc/json.service';


import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '@svc/api.service';
import { SalesService } from '@svc/Sales.service';

@Component({
  selector: 'stripe-pay',
  templateUrl: './stripe-pay.component.html',
  styleUrls: ['./stripe-pay.component.scss'],
})
export class StripePayComponent implements OnInit {

  stripe = Stripe(environment.stripePublishableKey);
  card: any = {};
  showStripePay: boolean = false;
  public chargeOptions: any = {};

  constructor(private stripeNgx: StripeNgx
    , private intServ: InterceptService
    , private apiService: ApiService
    , private js: JsonService
    , private salesService: SalesService
  ) {
    this.intServ.stripePay$.subscribe(
      (req: any) => {
        this.chargeOptions = req;
        console.log(this.chargeOptions);
        this.showStripePay = true;
      }
    )
  }

  public ngOnInit() {
    this.setupStripe();
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
    let data = {
      CustomerId: this.chargeOptions.CustomerId,
      TokenId: tokenId,
      Currency: this.chargeOptions.Currency,
      Amount: this.chargeOptions.Amount,
      DocumentNum: this.chargeOptions.DocumentNum
    }
    try {
      this.intServ.loadingFunc(true);
      let {chargeId} = await this.apiService.postData('mobile', 'paywithstripe', data);
      
      // Start Paid Success
      this.chargeOptions.paidBC.transactionNo = chargeId;
      let {Posted} = await this.salesService.paidPostedSalesInvoices(this.chargeOptions.paidBC);
      if (Posted) {
        this.intServ.alertFunc(this.js.getAlert('success', 'Success', 'Payment was successful'));
        this.onCancel();
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
    this.setupStripe();
    this.onClose();
  }

}
