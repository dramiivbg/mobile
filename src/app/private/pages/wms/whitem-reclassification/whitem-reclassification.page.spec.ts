import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WhitemReclassificationPage } from './whitem-reclassification.page';

describe('WhitemReclassificationPage', () => {
  let component: WhitemReclassificationPage;
  let fixture: ComponentFixture<WhitemReclassificationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WhitemReclassificationPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WhitemReclassificationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
