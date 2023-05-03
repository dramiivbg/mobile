import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WmsSplitMergePage } from './wms-split-merge.page';

describe('WmsSplitMergePage', () => {
  let component: WmsSplitMergePage;
  let fixture: ComponentFixture<WmsSplitMergePage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WmsSplitMergePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WmsSplitMergePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
