import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersPopulatedListComponent } from './users-populated-list.component';

describe('UsersPopulatedListComponent', () => {
  let component: UsersPopulatedListComponent;
  let fixture: ComponentFixture<UsersPopulatedListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsersPopulatedListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersPopulatedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
