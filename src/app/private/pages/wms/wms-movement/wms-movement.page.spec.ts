import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WmsMovementPage } from './wms-movement.page';

describe('WmsMovementPage', () => {
  let component: WmsMovementPage;
  let fixture: ComponentFixture<WmsMovementPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WmsMovementPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WmsMovementPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
