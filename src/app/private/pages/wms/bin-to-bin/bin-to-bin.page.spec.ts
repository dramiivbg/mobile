import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BinToBinPage } from './bin-to-bin.page';

describe('BinToBinPage', () => {
  let component: BinToBinPage;
  let fixture: ComponentFixture<BinToBinPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BinToBinPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BinToBinPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
