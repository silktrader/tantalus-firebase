import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteFoodDialogComponent } from './delete-food-dialog.component';

describe('DeleteFoodDialogComponent', () => {
  let component: DeleteFoodDialogComponent;
  let fixture: ComponentFixture<DeleteFoodDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteFoodDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteFoodDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
