import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from '@env/environment';
import { Stripe as StripeNgx, StripeCardTokenRes } from '@ionic-native/stripe/ngx';
declare var Stripe;

import { InterceptService } from '@svc/intercept.service';
import { JsonService } from '@svc/json.service';


import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '@svc/api.service';

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

  constructor(private stripeNgx: StripeNgx,
    private intServ: InterceptService,
    private apiService: ApiService) {

    this.intServ.alert$.subscribe(
      (req: any) => {
        this.chargeOptions = req;
        console.log(this.chargeOptions);
        this.showStripePay = true;
      }
    )
  }

  ngOnInit() {
    this.setupStripe();
  }

  onClose() {
    this.showStripePay = false;
  }

  setupStripe() {
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

  makePayment(tokenId: string) {

    this.intServ.loadingFunc(true);

    let data = {
      CustomerId: this.chargeOptions.CustomerId,
      TokenId: tokenId,
      Currency: this.chargeOptions.Currency,
      Amount: this.chargeOptions.Amount,
      DocumentNum: this.chargeOptions.DocumentNum
    }

    this.apiService.postData('mobile', 'paywithstripe', data).then(
      res => {
        console.log(res);
        this.intServ.loadingFunc(false);
      }
    ).catch(
      err => {
        var errorElement = document.getElementById('card-errors');
        errorElement.textContent = err.message;
        this.intServ.loadingFunc(false);
    });
  }

  async onCancel() {}

}
