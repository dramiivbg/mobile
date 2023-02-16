import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SplitItemComponent } from './split-item.component';

describe('SplitItemComponent', () => {
  let component: SplitItemComponent;
  let fixture: ComponentFixture<SplitItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SplitItemComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SplitItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
