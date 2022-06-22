import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PaymentsMadePage } from './payments-made.page';

describe('PaymentsMadePage', () => {
  let component: PaymentsMadePage;
  let fixture: ComponentFixture<PaymentsMadePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentsMadePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentsMadePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
