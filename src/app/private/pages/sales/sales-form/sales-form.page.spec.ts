import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SalesFormPage } from './sales-form.page';

describe('SalesFormPage', () => {
  let component: SalesFormPage;
  let fixture: ComponentFixture<SalesFormPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesFormPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SalesFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
