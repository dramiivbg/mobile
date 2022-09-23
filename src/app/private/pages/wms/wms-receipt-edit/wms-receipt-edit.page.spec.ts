import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WmsReceiptEditPage } from './wms-receipt-edit.page';

describe('WmsReceiptEditPage', () => {
  let component: WmsReceiptEditPage;
  let fixture: ComponentFixture<WmsReceiptEditPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WmsReceiptEditPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WmsReceiptEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
