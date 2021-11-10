import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PaymentMainPage } from './payment-main.page';

describe('PaymentMainPage', () => {
  let component: PaymentMainPage;
  let fixture: ComponentFixture<PaymentMainPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentMainPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentMainPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
