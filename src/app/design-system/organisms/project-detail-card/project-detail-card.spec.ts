import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DsProjectDetailCard } from './project-detail-card';
import { DsButton } from '../../atoms';
import { Project } from '../../../models';

const mockProject: Project = {
  id: 1,
  name: 'Apollo',
  description: 'Lunar program',
  owner: 'Neil Armstrong',
  ownerInitials: 'NA',
  status: 'Active',
  statusSeverity: 'success',
  avatar: 'A',
  color: '#3B82F6',
  members: 5,
  deadline: '2025-12-31',
  createdDate: '2025-01-01',
  category: 'Engineering',
};

describe('DsProjectDetailCard', () => {
  let fixture: ComponentFixture<DsProjectDetailCard>;
  let component: DsProjectDetailCard;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DsProjectDetailCard],
    }).compileComponents();
    fixture = TestBed.createComponent(DsProjectDetailCard);
    component = fixture.componentInstance;
  });

  // AC: GIVEN a project, WHEN rendered, THEN shows its core fields
  it('should render the project fields', async () => {
    fixture.componentRef.setInput('project', mockProject);
    fixture.detectChanges();
    // Read-only fields render via ngModel; let its writeValue flush to the DOM.
    await fixture.whenStable();
    fixture.detectChanges();

    const el = fixture.nativeElement;
    expect(el.querySelector('h1').textContent).toContain('Apollo');

    const fieldValues = Array.from(el.querySelectorAll('input')).map(
      (input) => (input as HTMLInputElement).value,
    );
    expect(fieldValues).toContain('Apollo');
    expect(fieldValues).toContain('Neil Armstrong');
    expect(fieldValues).toContain('Engineering');
    expect(fieldValues).toContain('Lunar program');
  });

  // AC: GIVEN the detail card, WHEN "Back to List" is clicked, THEN emits backClicked
  it('should emit backClicked when the back button is clicked', () => {
    fixture.componentRef.setInput('project', mockProject);
    fixture.detectChanges();

    const spy = vi.fn();
    component.backClicked.subscribe(spy);

    // "Back to List" is the last ds-button; trigger its `clicked` output since
    // PrimeNG p-button onClick doesn't fire via DOM dispatch in jsdom.
    const buttons = fixture.debugElement.queryAll(By.directive(DsButton));
    buttons[buttons.length - 1].componentInstance.clicked.emit();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledTimes(1);
  });
});
