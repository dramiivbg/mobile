import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PopoverConfigurationCodeComponent } from './popover-configuration-code.component';

describe('PopoverConfigurationCodeComponent', () => {
  let component: PopoverConfigurationCodeComponent;
  let fixture: ComponentFixture<PopoverConfigurationCodeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PopoverConfigurationCodeComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PopoverConfigurationCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
