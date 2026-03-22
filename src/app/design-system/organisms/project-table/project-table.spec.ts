import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DsProjectTable } from './project-table';
import { Project } from '../../../models';

const mockProject = (id: number, name = `Project ${id}`): Project => ({
  id,
  name,
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

  // AC: GIVEN 18 projects, WHEN rendered, THEN shows sortable table with all rows
  it('should render all projects when data provided', () => {
    const projects = Array.from({ length: 5 }, (_, i) => mockProject(i + 1));
    fixture.componentRef.setInput('projects', projects);
    fixture.detectChanges();

    const table = fixture.nativeElement.querySelector('p-table');
    expect(table).toBeTruthy();
    // filteredProjects should match input since no search term
    expect(component.filteredProjects().length).toBe(5);
  });

  // AC: GIVEN search typed "zzzzz", WHEN no matches, THEN shows "No results" state
  it('should show search-no-results when search matches nothing', () => {
    const projects = [mockProject(1, 'Alpha'), mockProject(2, 'Beta')];
    fixture.componentRef.setInput('projects', projects);
    fixture.detectChanges();

    // Set search term that matches nothing
    component.onSearch('zzzzz');
    fixture.detectChanges();

    expect(component.filteredProjects().length).toBe(0);
    const emptyState = fixture.nativeElement.querySelector('ds-empty-state');
    expect(emptyState).toBeTruthy();
  });
});
