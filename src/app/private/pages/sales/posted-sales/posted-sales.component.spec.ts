import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PostedSalesComponent } from './posted-sales.component';

describe('PostedSalesComponent', () => {
  let component: PostedSalesComponent;
  let fixture: ComponentFixture<PostedSalesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostedSalesComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PostedSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
