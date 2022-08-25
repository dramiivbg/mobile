import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WmsReceiptPage } from './wms-receipt.page';

describe('WmsReceiptPage', () => {
  let component: WmsReceiptPage;
  let fixture: ComponentFixture<WmsReceiptPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WmsReceiptPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WmsReceiptPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
