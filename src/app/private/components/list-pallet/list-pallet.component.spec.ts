import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListPalletComponent } from './list-pallet.component';

describe('ListPalletComponent', () => {
  let component: ListPalletComponent;
  let fixture: ComponentFixture<ListPalletComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListPalletComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListPalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
