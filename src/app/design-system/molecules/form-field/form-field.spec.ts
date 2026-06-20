import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { DsFormField } from './form-field';

@Component({
  imports: [DsFormField],
  template: `
    <ds-form-field label="Project Name" inputId="test-name">
      <input type="text" id="test-name" class="projected-input" />
    </ds-form-field>
  `,
})
class TestHost {}

describe('DsFormField', () => {
  // AC: GIVEN label="Project Name", WHEN rendered, THEN shows uppercase label above content slot
  it('should render the label', () => {
    TestBed.configureTestingModule({
      imports: [DsFormField],
    });
    const fixture = TestBed.createComponent(DsFormField);
    fixture.componentRef.setInput('label', 'Project Name');
    fixture.componentRef.setInput('inputId', 'test-label');
    fixture.detectChanges();

    const label = fixture.nativeElement.querySelector('.form-field-label');
    expect(label.textContent).toContain('Project Name');
  });

  // AC: GIVEN child content, WHEN rendered, THEN projects content below label
  it('should project ng-content', async () => {
    TestBed.configureTestingModule({
      imports: [TestHost],
    });
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();

    const projected = fixture.nativeElement.querySelector('.projected-input');
    expect(projected).toBeTruthy();
  });

  // AC: GIVEN fullWidth=true, WHEN rendered, THEN the field carries the full-width class
  it('should toggle the full-width class when fullWidth is true', () => {
    TestBed.configureTestingModule({
      imports: [DsFormField],
    });
    const fixture = TestBed.createComponent(DsFormField);
    fixture.componentRef.setInput('label', 'Project Name');
    fixture.componentRef.setInput('inputId', 'test-fw');

    fixture.detectChanges();
    const field = fixture.nativeElement.querySelector('.form-field');
    expect(field.classList.contains('full-width')).toBe(false);

    fixture.componentRef.setInput('fullWidth', true);
    fixture.detectChanges();
    expect(field.classList.contains('full-width')).toBe(true);
  });

  // AC: GIVEN inputId, WHEN rendered, THEN the label's for matches the projected input id
  it('should associate the label with the input via for/id', () => {
    TestBed.configureTestingModule({
      imports: [TestHost],
    });
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();

    const label: HTMLLabelElement = fixture.nativeElement.querySelector('.form-field-label');
    const input: HTMLInputElement = fixture.nativeElement.querySelector('.projected-input');
    expect(label.getAttribute('for')).toBe('test-name');
    expect(input.id).toBe('test-name');
    expect(label.getAttribute('for')).toBe(input.id);
  });
});
