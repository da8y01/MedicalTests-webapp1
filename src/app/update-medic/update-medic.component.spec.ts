import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateMedicComponent } from './update-medic.component';

describe('UpdateMedicComponent', () => {
  let component: UpdateMedicComponent;
  let fixture: ComponentFixture<UpdateMedicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateMedicComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateMedicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
