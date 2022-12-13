import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PopoverItemTrakingComponent } from './popover-item-traking.component';

describe('PopoverItemTrakingComponent', () => {
  let component: PopoverItemTrakingComponent;
  let fixture: ComponentFixture<PopoverItemTrakingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopoverItemTrakingComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PopoverItemTrakingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
