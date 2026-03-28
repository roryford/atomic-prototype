import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DsEmptyState } from './empty-state';

describe('DsEmptyState', () => {
  let fixture: ComponentFixture<DsEmptyState>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DsEmptyState],
    }).compileComponents();
    fixture = TestBed.createComponent(DsEmptyState);
  });

  // AC: GIVEN icon="pi-inbox" message="No data", WHEN rendered, THEN shows icon + message centered
  it('should render icon and message', () => {
    fixture.componentRef.setInput('message', 'No data');
    fixture.componentRef.setInput('icon', 'pi-inbox');
    fixture.detectChanges();

    const el = fixture.nativeElement;
    const icon = el.querySelector('.empty-icon');
    expect(icon).toBeTruthy();
    expect(icon.classList.contains('pi-inbox')).toBe(true);

    const message = el.querySelector('.empty-message');
    expect(message.textContent).toContain('No data');
  });

  // AC: GIVEN actionLabel="Create", WHEN rendered, THEN shows action button
  it('should show action button when actionLabel is set', () => {
    fixture.componentRef.setInput('message', 'Empty');
    fixture.componentRef.setInput('actionLabel', 'Create');
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('ds-button');
    expect(button).toBeTruthy();
  });

  // AC: GIVEN no actionLabel, WHEN rendered, THEN hides action button
  it('should hide action button when no actionLabel', () => {
    fixture.componentRef.setInput('message', 'Empty');
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('ds-button');
    expect(button).toBeFalsy();
  });
});
