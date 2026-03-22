import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DsInput } from './input';

describe('DsInput', () => {
  let fixture: ComponentFixture<DsInput>;
  let component: DsInput;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DsInput],
    }).compileComponents();
    fixture = TestBed.createComponent(DsInput);
    component = fixture.componentInstance;
  });

  // AC: GIVEN placeholder="Search...", WHEN rendered, THEN shows placeholder text
  it('should render with placeholder', () => {
    fixture.componentRef.setInput('placeholder', 'Search...');
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input');
    expect(input.placeholder).toBe('Search...');
  });

  // AC: GIVEN value bound via model, WHEN user types, THEN model updates
  it('should support two-way value binding', async () => {
    fixture.detectChanges();
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    input.value = 'Hello';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.value()).toBe('Hello');
  });

  // AC: GIVEN input with no props, WHEN rendered, THEN renders empty
  it('should render with empty default value', () => {
    fixture.detectChanges();
    expect(component.value()).toBe('');
    expect(component.placeholder()).toBe('');
  });
});
