import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DsStatCard } from './stat-card';

describe('DsStatCard', () => {
  let fixture: ComponentFixture<DsStatCard>;
  let component: DsStatCard;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DsStatCard],
    }).compileComponents();
    fixture = TestBed.createComponent(DsStatCard);
    component = fixture.componentInstance;
  });

  // AC: GIVEN label + value + icon, WHEN rendered, THEN shows icon left, value + label stacked right
  it('should render label, value, and icon', () => {
    fixture.componentRef.setInput('label', 'Total Users');
    fixture.componentRef.setInput('value', '1,234');
    fixture.componentRef.setInput('icon', 'pi-users');
    fixture.detectChanges();

    const el = fixture.nativeElement;
    expect(el.querySelector('.stat-label').textContent).toContain('Total Users');
    expect(el.querySelector('.stat-value').textContent).toContain('1,234');
    expect(el.querySelector('.stat-icon')).toBeTruthy();
  });

  // AC: GIVEN icon="pi-users", WHEN rendered, THEN shows users icon with primary color
  it('should apply the correct icon class', () => {
    fixture.componentRef.setInput('label', 'Users');
    fixture.componentRef.setInput('value', '42');
    fixture.componentRef.setInput('icon', 'pi-users');
    fixture.detectChanges();

    const icon = fixture.nativeElement.querySelector('.stat-icon i');
    expect(icon.classList.contains('pi-users')).toBe(true);
  });
});
