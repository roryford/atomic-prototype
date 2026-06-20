import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DsProjectCardGrid } from './project-card-grid';
import { Project } from '../../../models';

const mockProject = (id: number): Project => ({
  id,
  name: `Project ${id}`,
  description: `Description ${id}`,
  owner: `Owner ${id}`,
  ownerInitials: 'OW',
  status: 'Active',
  statusSeverity: 'success',
  avatar: 'A',
  color: '#3B82F6',
  members: 5,
  deadline: '2025-12-31',
  createdDate: '2025-01-01',
  category: 'Engineering',
});

describe('DsProjectCardGrid', () => {
  let fixture: ComponentFixture<DsProjectCardGrid>;
  let component: DsProjectCardGrid;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DsProjectCardGrid],
    }).compileComponents();
    fixture = TestBed.createComponent(DsProjectCardGrid);
    component = fixture.componentInstance;
  });

  // AC: GIVEN isLoading=true, WHEN rendered, THEN shows 3 skeleton cards (180px height)
  it('should show skeletons when loading', () => {
    fixture.componentRef.setInput('isLoading', true);
    fixture.detectChanges();

    const skeletons = fixture.nativeElement.querySelectorAll('p-skeleton');
    expect(skeletons.length).toBe(3);
  });

  // AC: GIVEN error is set, WHEN rendered, THEN shows error message with retry button
  it('should show error when error set', () => {
    fixture.componentRef.setInput('error', 'Failed to load');
    fixture.detectChanges();

    const message = fixture.nativeElement.querySelector('p-message');
    expect(message).toBeTruthy();
    const retryBtn = fixture.nativeElement.querySelector('ds-button');
    expect(retryBtn).toBeTruthy();
  });

  // AC: GIVEN projects=[] (empty), WHEN rendered, THEN shows empty state
  it('should show empty state when projects empty', () => {
    fixture.componentRef.setInput('projects', []);
    fixture.detectChanges();

    const emptyState = fixture.nativeElement.querySelector('ds-empty-state');
    expect(emptyState).toBeTruthy();
  });

  // AC: GIVEN project card, WHEN clicked, THEN emits projectSelected
  it('should emit projectSelected when card clicked', () => {
    const projects = [mockProject(1), mockProject(2)];
    fixture.componentRef.setInput('projects', projects);
    fixture.detectChanges();

    const spy = vi.fn();
    component.projectSelected.subscribe(spy);

    const card = fixture.nativeElement.querySelector('p-card');
    card.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledWith(projects[0]);
  });

  // AC: GIVEN a card, WHEN it carries an accessible name, THEN aria-label names the project
  it('should expose an aria-label naming the project', () => {
    const projects = [mockProject(1)];
    fixture.componentRef.setInput('projects', projects);
    fixture.detectChanges();

    const card = fixture.nativeElement.querySelector('p-card');
    expect(card.getAttribute('aria-label')).toBe('View project Project 1');
  });

  // AC: GIVEN keyboard focus on a card, WHEN Enter pressed, THEN emits projectSelected
  it('should emit projectSelected on Enter keydown', () => {
    const projects = [mockProject(1), mockProject(2)];
    fixture.componentRef.setInput('projects', projects);
    fixture.detectChanges();

    const spy = vi.fn();
    component.projectSelected.subscribe(spy);

    const card = fixture.nativeElement.querySelector('p-card');
    card.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledWith(projects[0]);
  });

  // AC: GIVEN keyboard focus on a card, WHEN Space pressed, THEN emits projectSelected
  it('should emit projectSelected on Space keydown', () => {
    const projects = [mockProject(1), mockProject(2)];
    fixture.componentRef.setInput('projects', projects);
    fixture.detectChanges();

    const spy = vi.fn();
    component.projectSelected.subscribe(spy);

    const card = fixture.nativeElement.querySelector('p-card');
    card.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledWith(projects[0]);
  });

  // AC: GIVEN keyboard focus on a card, WHEN a non-activating key pressed, THEN no emit
  it('should not emit projectSelected for other keys', () => {
    const projects = [mockProject(1)];
    fixture.componentRef.setInput('projects', projects);
    fixture.detectChanges();

    const spy = vi.fn();
    component.projectSelected.subscribe(spy);

    const card = fixture.nativeElement.querySelector('p-card');
    card.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
    fixture.detectChanges();

    expect(spy).not.toHaveBeenCalled();
  });
});
