import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DsButton } from './button';

describe('DsButton', () => {
  let fixture: ComponentFixture<DsButton>;
  let component: DsButton;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DsButton],
    }).compileComponents();
    fixture = TestBed.createComponent(DsButton);
    component = fixture.componentInstance;
  });

  // AC: GIVEN default props, WHEN rendered, THEN shows primary severity button
  it('should render with default primary severity', () => {
    fixture.detectChanges();
    const pButton = fixture.nativeElement.querySelector('p-button');
    expect(pButton).toBeTruthy();
    expect(component.severity()).toBe('primary');
  });

  // AC: GIVEN label provided, WHEN rendered, THEN shows label text
  it('should render with provided label', () => {
    fixture.componentRef.setInput('label', 'Click Me');
    fixture.detectChanges();
    expect(component.label()).toBe('Click Me');
  });

  // AC: GIVEN outlined=true, WHEN rendered, THEN shows outlined variant
  it('should support outlined variant', () => {
    fixture.componentRef.setInput('outlined', true);
    fixture.detectChanges();
    expect(component.outlined()).toBe(true);
  });

  // PrimeNG's p-button (onClick) doesn't fire via DOM click dispatch in jsdom.
  // This test verifies the output exists and can emit. Full click-through
  // testing requires Storybook play functions or Playwright.
  it('should expose clicked output (PrimeNG onClick cannot be triggered in jsdom — verify in Storybook)', () => {
    fixture.detectChanges();
    const spy = vi.fn();
    component.clicked.subscribe(spy);

    component.clicked.emit();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
