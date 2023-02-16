import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditPutAwayComponent } from './edit-put-away.component';

describe('EditPutAwayComponent', () => {
  let component: EditPutAwayComponent;
  let fixture: ComponentFixture<EditPutAwayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPutAwayComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditPutAwayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
