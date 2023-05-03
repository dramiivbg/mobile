import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PopoverChildrensPalletComponent } from './popover-childrens-pallet.component';

describe('PopoverChildrensPalletComponent', () => {
  let component: PopoverChildrensPalletComponent;
  let fixture: ComponentFixture<PopoverChildrensPalletComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PopoverChildrensPalletComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PopoverChildrensPalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
