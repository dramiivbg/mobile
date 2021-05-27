import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SalesPagePage } from './sales-page.page';

describe('SalesPagePage', () => {
  let component: SalesPagePage;
  let fixture: ComponentFixture<SalesPagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesPagePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SalesPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
