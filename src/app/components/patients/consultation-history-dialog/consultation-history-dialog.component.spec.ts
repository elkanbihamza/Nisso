import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultationHistoryDialogComponent } from './consultation-history-dialog.component';

describe('ConsultationHistoryDialogComponent', () => {
  let component: ConsultationHistoryDialogComponent;
  let fixture: ComponentFixture<ConsultationHistoryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultationHistoryDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConsultationHistoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
