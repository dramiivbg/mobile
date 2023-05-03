import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PopoverAddItemTrakingComponent } from './popover-add-item-traking.component';

describe('PopoverAddItemTrakingComponent', () => {
  let component: PopoverAddItemTrakingComponent;
  let fixture: ComponentFixture<PopoverAddItemTrakingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PopoverAddItemTrakingComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PopoverAddItemTrakingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
