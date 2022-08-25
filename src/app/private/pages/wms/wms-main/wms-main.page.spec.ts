import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WmsMainPage } from './wms-main.page';

describe('WmsMainPage', () => {
  let component: WmsMainPage;
  let fixture: ComponentFixture<WmsMainPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WmsMainPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WmsMainPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
