import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PopoverSelectPalletComponent } from './popover-select-pallet.component';

describe('PopoverSelectPalletComponent', () => {
  let component: PopoverSelectPalletComponent;
  let fixture: ComponentFixture<PopoverSelectPalletComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopoverSelectPalletComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PopoverSelectPalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
