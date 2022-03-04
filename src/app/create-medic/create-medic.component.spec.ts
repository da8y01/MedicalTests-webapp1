import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMedicComponent } from './create-medic.component';

describe('CreateMedicComponent', () => {
  let component: CreateMedicComponent;
  let fixture: ComponentFixture<CreateMedicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateMedicComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateMedicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
