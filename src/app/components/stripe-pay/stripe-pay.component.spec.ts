import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StripePayComponent } from './stripe-pay.component';

describe('StripePayComponent', () => {
  let component: StripePayComponent;
  let fixture: ComponentFixture<StripePayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StripePayComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StripePayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
