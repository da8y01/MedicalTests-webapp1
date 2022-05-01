import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateReadingsComponent } from './update-readings.component';

describe('UpdateReadingsComponent', () => {
  let component: UpdateReadingsComponent;
  let fixture: ComponentFixture<UpdateReadingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateReadingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateReadingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
