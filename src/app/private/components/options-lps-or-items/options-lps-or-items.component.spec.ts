import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OptionsLpsOrItemsComponent } from './options-lps-or-items.component';

describe('OptionsLpsOrItemsComponent', () => {
  let component: OptionsLpsOrItemsComponent;
  let fixture: ComponentFixture<OptionsLpsOrItemsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OptionsLpsOrItemsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OptionsLpsOrItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
