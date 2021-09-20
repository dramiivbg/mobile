import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ChangeInstancePage } from './change-instance.page';

describe('ChangeInstancePage', () => {
  let component: ChangeInstancePage;
  let fixture: ComponentFixture<ChangeInstancePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeInstancePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ChangeInstancePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
