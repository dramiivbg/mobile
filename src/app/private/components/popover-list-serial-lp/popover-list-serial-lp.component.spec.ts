import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PopoverListSerialLpComponent } from './popover-list-serial-lp.component';

describe('PopoverListSerialLpComponent', () => {
  let component: PopoverListSerialLpComponent;
  let fixture: ComponentFixture<PopoverListSerialLpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopoverListSerialLpComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PopoverListSerialLpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
