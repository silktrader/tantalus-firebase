import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiaryOutletComponent } from './diary-outlet.component';

describe('DiaryOutletComponent', () => {
  let component: DiaryOutletComponent;
  let fixture: ComponentFixture<DiaryOutletComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiaryOutletComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiaryOutletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
