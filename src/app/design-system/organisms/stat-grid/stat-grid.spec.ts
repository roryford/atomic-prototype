import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DsStatGrid } from './stat-grid';
import { DsButton } from '../../atoms';
import { DashboardStats } from '../../../models';

describe('DsStatGrid', () => {
  let fixture: ComponentFixture<DsStatGrid>;
  let component: DsStatGrid;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DsStatGrid],
    }).compileComponents();
    fixture = TestBed.createComponent(DsStatGrid);
    component = fixture.componentInstance;
  });

  // AC: GIVEN isLoading=true, WHEN rendered, THEN shows 4 skeleton rectangles (88px height)
  it('should show 4 skeletons when isLoading=true', () => {
    fixture.componentRef.setInput('isLoading', true);
    fixture.detectChanges();

    const skeletons = fixture.nativeElement.querySelectorAll('p-skeleton');
    expect(skeletons.length).toBe(4);
  });

  // AC: GIVEN error is set, WHEN rendered, THEN shows error message with retry button
  it('should show error message when error is set', () => {
    fixture.componentRef.setInput('error', 'Unable to load stats');
    fixture.detectChanges();

    const message = fixture.nativeElement.querySelector('p-message');
    expect(message).toBeTruthy();
    const retryBtn = fixture.nativeElement.querySelector('ds-button');
    expect(retryBtn).toBeTruthy();
  });

  // AC: GIVEN error state, WHEN retry button activated, THEN emits retryClicked
  it('should emit retryClicked when the retry button is clicked', () => {
    fixture.componentRef.setInput('error', 'Unable to load stats');
    fixture.detectChanges();

    const spy = vi.fn();
    component.retryClicked.subscribe(spy);

    // PrimeNG p-button onClick doesn't fire via DOM dispatch in jsdom; trigger
    // the rendered ds-button's `clicked` output to exercise the real
    // (clicked)="retryClicked.emit()" template binding.
    const retryBtn = fixture.debugElement.query(By.directive(DsButton));
    retryBtn.componentInstance.clicked.emit();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  // AC: GIVEN stats=[] (empty), WHEN rendered, THEN shows empty state
  it('should show empty state when stats is empty array', () => {
    fixture.componentRef.setInput('stats', []);
    fixture.detectChanges();

    const emptyState = fixture.nativeElement.querySelector('ds-empty-state');
    expect(emptyState).toBeTruthy();
  });

  // AC: GIVEN 4 stats, WHEN rendered, THEN shows 4 DsStatCard components
  it('should render correct number of stat cards when data provided', () => {
    const stats: DashboardStats[] = [
      { label: 'Users', value: '100', icon: 'pi-users' },
      { label: 'Projects', value: '50', icon: 'pi-briefcase' },
      { label: 'Tasks', value: '200', icon: 'pi-check-square' },
      { label: 'Revenue', value: '$10k', icon: 'pi-dollar' },
    ];
    fixture.componentRef.setInput('stats', stats);
    fixture.detectChanges();

    const cards = fixture.nativeElement.querySelectorAll('ds-stat-card');
    expect(cards.length).toBe(4);
  });
});
