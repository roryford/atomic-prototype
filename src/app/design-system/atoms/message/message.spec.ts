import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DsMessage } from './message';

describe('DsMessage', () => {
  let fixture: ComponentFixture<DsMessage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DsMessage],
    }).compileComponents();
    fixture = TestBed.createComponent(DsMessage);
  });

  // AC: GIVEN text="Project not found", WHEN rendered, THEN displays the text
  it('should render the message text in the DOM', () => {
    fixture.componentRef.setInput('text', 'Project not found');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Project not found');
  });

  // AC: GIVEN severity="error", WHEN rendered, THEN reflects error styling
  it('should reflect severity on the rendered message', () => {
    fixture.componentRef.setInput('severity', 'error');
    fixture.componentRef.setInput('text', 'Oops');
    fixture.detectChanges();
    const msg: HTMLElement = fixture.nativeElement.querySelector('.p-message');
    expect(msg).toBeTruthy();
    expect(msg.className).toContain('p-message-error');
  });
});
