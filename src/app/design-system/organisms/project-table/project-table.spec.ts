import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DsProjectTable } from './project-table';
import { DsButton } from '../../atoms';
import { Project } from '../../../models';

interface MockProjectOverrides {
  name?: string;
  owner?: string;
  status?: string;
}

const mockProject = (id: number, overrides: MockProjectOverrides = {}): Project => ({
  id,
  name: overrides.name ?? `Project ${id}`,
  description: `Description ${id}`,
  owner: overrides.owner ?? `Owner ${id}`,
  ownerInitials: 'OW',
  status: overrides.status ?? 'Active',
  statusSeverity: 'success',
  avatar: 'A',
  color: '#3B82F6',
  members: 5,
  deadline: '2025-12-31',
  createdDate: '2025-01-01',
  category: 'Engineering',
});

/** Counts the rendered project rows in the p-table body (excludes the header row). */
const renderedRowCount = (fixture: ComponentFixture<DsProjectTable>): number =>
  fixture.nativeElement.querySelectorAll('p-table tbody tr').length;

describe('DsProjectTable', () => {
  let fixture: ComponentFixture<DsProjectTable>;
  let component: DsProjectTable;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DsProjectTable],
    }).compileComponents();
    fixture = TestBed.createComponent(DsProjectTable);
    component = fixture.componentInstance;
  });

  // AC: GIVEN isLoading=true, WHEN rendered, THEN shows skeleton header + 5 skeleton rows
  it('should show skeletons when loading', () => {
    fixture.componentRef.setInput('isLoading', true);
    fixture.detectChanges();

    const skeletons = fixture.nativeElement.querySelectorAll('p-skeleton');
    // 1 header skeleton + 5 row skeletons = 6
    expect(skeletons.length).toBe(6);
  });

  // AC: GIVEN error is set, WHEN rendered, THEN shows error message with retry button
  it('should show error when error set', () => {
    fixture.componentRef.setInput('error', 'Network error');
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

  // AC: GIVEN 5 projects, WHEN rendered, THEN shows sortable table with all rows
  it('should render all projects when data provided', () => {
    const projects = Array.from({ length: 5 }, (_, i) => mockProject(i + 1));
    fixture.componentRef.setInput('projects', projects);
    fixture.detectChanges();

    const table = fixture.nativeElement.querySelector('p-table');
    expect(table).toBeTruthy();
    // No search term, so every project renders as a DOM row.
    expect(renderedRowCount(fixture)).toBe(5);
  });

  // AC: GIVEN search matches a project name, WHEN typed, THEN only matching rows render
  it('should filter by name match', () => {
    const projects = [
      mockProject(1, { name: 'Alpha' }),
      mockProject(2, { name: 'Beta' }),
      mockProject(3, { name: 'Gamma' }),
    ];
    fixture.componentRef.setInput('projects', projects);
    fixture.detectChanges();

    component.onSearch('beta');
    fixture.detectChanges();

    expect(component.filteredProjects()).toEqual([projects[1]]);
    expect(renderedRowCount(fixture)).toBe(1);
    expect(fixture.nativeElement.querySelector('.name-cell').textContent).toContain('Beta');
  });

  // AC: GIVEN search matches an owner, WHEN typed, THEN only matching rows render
  it('should filter by owner match', () => {
    const projects = [
      mockProject(1, { name: 'Alpha', owner: 'Alice' }),
      mockProject(2, { name: 'Beta', owner: 'Bob' }),
    ];
    fixture.componentRef.setInput('projects', projects);
    fixture.detectChanges();

    component.onSearch('alice');
    fixture.detectChanges();

    expect(component.filteredProjects()).toEqual([projects[0]]);
    expect(renderedRowCount(fixture)).toBe(1);
  });

  // AC: GIVEN search matches a status, WHEN typed, THEN only matching rows render
  it('should filter by status match', () => {
    const projects = [
      mockProject(1, { name: 'Alpha', status: 'Active' }),
      mockProject(2, { name: 'Beta', status: 'Archived' }),
    ];
    fixture.componentRef.setInput('projects', projects);
    fixture.detectChanges();

    component.onSearch('archived');
    fixture.detectChanges();

    expect(component.filteredProjects()).toEqual([projects[1]]);
    expect(renderedRowCount(fixture)).toBe(1);
  });

  // AC: GIVEN search typed "zzzzz", WHEN no matches, THEN shows "No results" state
  it('should show search-no-results when search matches nothing', () => {
    const projects = [mockProject(1, { name: 'Alpha' }), mockProject(2, { name: 'Beta' })];
    fixture.componentRef.setInput('projects', projects);
    fixture.detectChanges();

    // Set search term that matches nothing
    component.onSearch('zzzzz');
    fixture.detectChanges();

    expect(component.filteredProjects().length).toBe(0);
    expect(renderedRowCount(fixture)).toBe(0);
    const emptyState = fixture.nativeElement.querySelector('ds-empty-state');
    expect(emptyState).toBeTruthy();
  });

  // AC: GIVEN active search, WHEN clearSearch() called, THEN all rows render again
  it('should reset the filter when clearSearch is called', () => {
    const projects = [mockProject(1, { name: 'Alpha' }), mockProject(2, { name: 'Beta' })];
    fixture.componentRef.setInput('projects', projects);
    fixture.detectChanges();

    component.onSearch('alpha');
    fixture.detectChanges();
    expect(renderedRowCount(fixture)).toBe(1);

    component.clearSearch();
    fixture.detectChanges();

    expect(component.searchTerm()).toBe('');
    expect(renderedRowCount(fixture)).toBe(2);
  });

  // AC: GIVEN a project row, WHEN its View button is clicked, THEN emits projectSelected
  it('should emit projectSelected when a row action button is clicked', () => {
    const projects = [mockProject(1, { name: 'Alpha' }), mockProject(2, { name: 'Beta' })];
    fixture.componentRef.setInput('projects', projects);
    fixture.detectChanges();

    const spy = vi.fn();
    component.projectSelected.subscribe(spy);

    // PrimeNG p-button onClick doesn't fire via DOM dispatch in jsdom; trigger
    // the first row's "View" ds-button `clicked` output, which runs the
    // (clicked)="projectSelected.emit(project)" template binding. The search
    // bar also renders a ds-button, so select the first "View" one explicitly.
    const viewButton = fixture.debugElement
      .queryAll(By.directive(DsButton))
      .find((btn) => btn.componentInstance.label() === 'View');
    expect(viewButton).toBeTruthy();
    viewButton!.componentInstance.clicked.emit();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledWith(projects[0]);
  });

  // AC: GIVEN error state, WHEN retry button activated, THEN emits retryClicked
  it('should emit retryClicked when the retry button is clicked', () => {
    fixture.componentRef.setInput('error', 'Network error');
    fixture.detectChanges();

    const spy = vi.fn();
    component.retryClicked.subscribe(spy);

    const retryBtn = fixture.debugElement.query(By.directive(DsButton));
    retryBtn.componentInstance.clicked.emit();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledTimes(1);
  });
});
