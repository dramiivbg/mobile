import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WmsItemJournalPage } from './wms-item-journal.page';

describe('WmsItemJournalPage', () => {
  let component: WmsItemJournalPage;
  let fixture: ComponentFixture<WmsItemJournalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WmsItemJournalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WmsItemJournalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
