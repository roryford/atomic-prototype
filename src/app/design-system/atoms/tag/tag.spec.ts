import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DsTag } from './tag';

describe('DsTag', () => {
  let fixture: ComponentFixture<DsTag>;
  let component: DsTag;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DsTag],
    }).compileComponents();
    fixture = TestBed.createComponent(DsTag);
    component = fixture.componentInstance;
  });

  // AC: GIVEN value="Active", WHEN rendered, THEN displays "Active" text
  it('should render the tag value', () => {
    fixture.componentRef.setInput('value', 'Active');
    fixture.detectChanges();
    expect(component.value()).toBe('Active');
    const el = fixture.nativeElement;
    expect(el.querySelector('p-tag')).toBeTruthy();
  });

  // AC: GIVEN severity="success", WHEN rendered, THEN shows success styling
  it('should render with severity', () => {
    fixture.componentRef.setInput('value', 'Done');
    fixture.componentRef.setInput('severity', 'success');
    fixture.detectChanges();
    expect(component.severity()).toBe('success');
  });

  // AC: GIVEN no severity, WHEN rendered, THEN renders without severity
  it('should render without severity when not provided', () => {
    fixture.componentRef.setInput('value', 'Neutral');
    fixture.detectChanges();
    expect(component.severity()).toBeUndefined();
  });
});
