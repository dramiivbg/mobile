import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EnviromentsPage } from './enviroments.page';

describe('EnviromentsPage', () => {
  let component: EnviromentsPage;
  let fixture: ComponentFixture<EnviromentsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnviromentsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EnviromentsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
