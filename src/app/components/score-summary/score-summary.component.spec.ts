import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreSummaryComponent } from './score-summary.component';

describe('ScoreSummaryComponent', () => {
  let component: ScoreSummaryComponent;
  let fixture: ComponentFixture<ScoreSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScoreSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScoreSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
