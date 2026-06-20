import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DsTag } from './tag';

describe('DsTag', () => {
  let fixture: ComponentFixture<DsTag>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DsTag],
    }).compileComponents();
    fixture = TestBed.createComponent(DsTag);
  });

  // AC: GIVEN value="Active", WHEN rendered, THEN displays "Active" text
  it('should render the tag value in the DOM', () => {
    fixture.componentRef.setInput('value', 'Active');
    fixture.detectChanges();
    const tag: HTMLElement = fixture.nativeElement.querySelector('.p-tag');
    expect(tag).toBeTruthy();
    expect(tag.textContent).toContain('Active');
  });

  // AC: GIVEN severity="success", WHEN rendered, THEN shows success styling
  it('should reflect severity on the rendered tag', () => {
    fixture.componentRef.setInput('value', 'Done');
    fixture.componentRef.setInput('severity', 'success');
    fixture.detectChanges();
    const tag: HTMLElement = fixture.nativeElement.querySelector('.p-tag');
    expect(tag.className).toContain('p-tag-success');
  });

  // AC: GIVEN no severity, WHEN rendered, THEN renders without a severity class
  it('should render without a severity class when not provided', () => {
    fixture.componentRef.setInput('value', 'Neutral');
    fixture.detectChanges();
    const tag: HTMLElement = fixture.nativeElement.querySelector('.p-tag');
    expect(tag).toBeTruthy();
    expect(tag.className).not.toContain('p-tag-success');
    expect(tag.className).not.toContain('p-tag-info');
    expect(tag.className).not.toContain('p-tag-danger');
  });
});
