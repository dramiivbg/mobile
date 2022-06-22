import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WmsComponent } from './wms.component';

describe('WmsComponent', () => {
  let component: WmsComponent;
  let fixture: ComponentFixture<WmsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WmsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
