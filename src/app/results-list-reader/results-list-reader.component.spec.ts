import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultsListReaderComponent } from './results-list-reader.component';

describe('ResultsListReaderComponent', () => {
  let component: ResultsListReaderComponent;
  let fixture: ComponentFixture<ResultsListReaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResultsListReaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultsListReaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
