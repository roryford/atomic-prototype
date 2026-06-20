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
    // The underlying native button should carry the primary severity class.
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(button).toBeTruthy();
    expect(button.className).toContain('p-button');
  });

  // AC: GIVEN label provided, WHEN rendered, THEN shows label text
  it('should render the provided label in the DOM', () => {
    fixture.componentRef.setInput('label', 'Click Me');
    fixture.detectChanges();
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(button.textContent).toContain('Click Me');
  });

  // AC: GIVEN outlined=true, WHEN rendered, THEN shows outlined variant
  it('should support outlined variant', () => {
    fixture.componentRef.setInput('outlined', true);
    fixture.detectChanges();
    // PrimeNG applies the p-button-outlined class to the native button when outlined.
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(button.className).toContain('p-button-outlined');
  });

  // AC: GIVEN severity set, WHEN rendered, THEN underlying button reflects the severity
  it('should reflect severity on the underlying button', () => {
    fixture.componentRef.setInput('severity', 'danger');
    fixture.detectChanges();
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(button.className).toContain('p-button-danger');
  });

  // AC: GIVEN a user clicks the button, WHEN the native click fires, THEN clicked emits
  it('should emit clicked when the native button is clicked', () => {
    fixture.detectChanges();
    const spy = vi.fn();
    component.clicked.subscribe(spy);

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    button.click();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledTimes(1);
  });
});
