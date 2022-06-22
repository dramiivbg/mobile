import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PostedPage } from './posted.page';

describe('PostedPage', () => {
  let component: PostedPage;
  let fixture: ComponentFixture<PostedPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostedPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PostedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
